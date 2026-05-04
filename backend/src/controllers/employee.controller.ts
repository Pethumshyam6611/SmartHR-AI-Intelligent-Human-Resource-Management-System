import { Request, Response } from 'express';
import prisma from '../config/database';
import { Role } from '@prisma/client';

const getViewerDepartment = async (userId?: string) => {
    if (!userId) return null;

    const employee = await prisma.employee.findUnique({
        where: { userId },
        select: { department: true },
    });

    return employee?.department ?? null;
};

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
        const whereClause: any = {};

        if (req.user?.role === Role.DEPARTMENT_HEAD) {
            const department = await getViewerDepartment(req.user?.id);
            whereClause.department = department ?? '__NO_DEPARTMENT__';
        }

        const employees = await prisma.employee.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                joiningDate: 'desc',
            },
        });

        res.json(employees);
    } catch (error) {
        console.error('Get all employees error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                attendances: {
                    orderBy: { date: 'desc' },
                    take: 10,
                },
                leaves: {
                    orderBy: { appliedAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }

        if (req.user?.role === Role.EMPLOYEE && req.user.employeeId !== id) {
            res.status(403).json({ message: 'Insufficient permissions' });
            return;
        }

        if (req.user?.role === Role.DEPARTMENT_HEAD) {
            const department = await getViewerDepartment(req.user?.id);

            if (!department || employee.department !== department) {
                res.status(403).json({ message: 'Insufficient permissions' });
                return;
            }
        }

        res.json(employee);
    } catch (error) {
        console.error('Get employee by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
            address,
            department,
            position,
            salary,
        } = req.body;

        // Check if employee exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { id },
        });

        if (!existingEmployee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }

        // Update employee
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: {
                firstName,
                lastName,
                phoneNumber,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                address,
                department,
                position,
                salary: salary ? parseFloat(salary) : undefined,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        res.json({
            message: 'Employee updated successfully',
            employee: updatedEmployee,
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const toggleEmployeeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });

        if (!existingEmployee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }

        // Don't toggle PENDING status
        if (existingEmployee.user.status === 'PENDING') {
            res.status(400).json({ message: 'Cannot toggle status of pending employees' });
            return;
        }

        // Toggle status between ACTIVE and INACTIVE
        const newStatus = existingEmployee.user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        // Update user status
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: {
                user: {
                    update: {
                        status: newStatus,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        status: true,
                    },
                },
            },
        });

        res.json({
            message: `Employee ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`,
            employee: updatedEmployee,
        });
    } catch (error) {
        console.error('Toggle employee status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const existingEmployee = await prisma.employee.findUnique({
            where: { id },
        });

        if (!existingEmployee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }

        // Delete user (cascade will delete employee and related records)
        await prisma.user.delete({
            where: { id: existingEmployee.userId },
        });

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
