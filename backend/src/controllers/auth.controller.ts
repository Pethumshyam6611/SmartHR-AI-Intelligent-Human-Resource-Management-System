import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { sendEmail } from '../services/email.service'; // We'll create this service
import crypto from 'crypto';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { employee: true },
        });

        if (!user || user.status !== 'ACTIVE') {
            res.status(401).json({ message: 'Invalid credentials or inactive account' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                employeeId: user.employee?.id
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.status !== 'ACTIVE') {
            res.json({
                message: 'If an active account exists for this email, a password reset link has been sent.',
            });
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiresAt,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: email,
            subject: 'SmartHR password reset',
            text: `Reset your SmartHR password using this link: ${resetLink}. This link expires in 30 minutes.`,
            html: `<p>Reset your SmartHR password by clicking <a href="${resetLink}">this link</a>.</p><p>This link expires in 30 minutes.</p>`,
        });

        res.json({
            message: 'If an active account exists for this email, a password reset link has been sent.',
            resetLink,
        });
    } catch (error) {
        console.error('Request password reset error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            res.status(400).json({ message: 'Reset token and new password are required' });
            return;
        }

        if (String(password).length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long' });
            return;
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiresAt: null,
            },
        });

        res.json({ message: 'Password reset successful. Please log in.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const inviteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore - assuming middleware sets user
        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'HR_MANAGER') {
            res.status(403).json({ message: 'Access denied' });
            return;
        }

        const { email, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tempPassword = await bcrypt.hash(token, 10); // Placeholder password

        await prisma.user.create({
            data: {
                email,
                password: tempPassword,
                role: role || 'EMPLOYEE',
                status: 'PENDING',
                invitationToken: token,
            },
        });

        // Send Email
        const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register?token=${token}`;
        await sendEmail({
            to: email,
            subject: 'Invitation to SmartHR',
            text: `You have been invited to join SmartHR. Click here to register: ${inviteLink}`,
            html: `<p>You have been invited to join <b>SmartHR</b>.</p><p>Click <a href="${inviteLink}">here</a> to complete your registration.</p>`
        });

        // Return registration link for development (when email service is mocked)
        res.status(201).json({
            message: 'Invitation sent successfully',
            registrationLink: inviteLink, // For development - remove in production
            email: email
        });
    } catch (error) {
        console.error('Invite error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, firstName, lastName, password, nic, department, position, address, phoneNumber, dateOfBirth } = req.body;

        const user = await prisma.user.findUnique({ where: { invitationToken: token } });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired invitation token' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction to update user and create employee
        await prisma.$transaction(async (tx) => {
            // Update User
            await tx.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    status: 'ACTIVE',
                    invitationToken: null,
                },
            });

            // Create Employee
            await tx.employee.create({
                data: {
                    userId: user.id,
                    firstName,
                    lastName,
                    nic,
                    department,
                    position,
                    address,
                    phoneNumber,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                    salary: 0, // Default or passed
                },
            });
        });

        res.json({ message: 'Registration successful. Please login.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { firstName, lastName, address, phoneNumber, currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { employee: true },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Update Password if provided
        if (currentPassword && newPassword) {
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                res.status(400).json({ message: 'Invalid current password' });
                return;
            }
            const hashed = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashed },
            });
        }

        // Update Employee Details
        if (user.employee) {
            await prisma.employee.update({
                where: { id: user.employee.id },
                data: {
                    firstName,
                    lastName,
                    address,
                    phoneNumber,
                },
            });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
