import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApplicationStatus } from '@prisma/client';

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobPostingId, applicantName, applicantEmail, applicantPhone, coverLetter } = req.body;
        const file = req.file;

        if (!jobPostingId || !applicantName || !applicantEmail || !file) {
            res.status(400).json({ message: 'Required fields are missing' });
            return;
        }

        // Check if job exists and is open
        const job = await prisma.jobPosting.findUnique({
            where: { id: jobPostingId },
        });

        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        if (job.status !== 'OPEN') {
            res.status(400).json({ message: 'Job posting is closed' });
            return;
        }

        const application = await prisma.application.create({
            data: {
                jobPostingId,
                applicantName,
                applicantEmail,
                applicantPhone,
                resumePath: file.path,
                coverLetter,
                status: ApplicationStatus.SUBMITTED,
            },
        });

        res.json({
            message: 'Application submitted successfully',
            application,
        });
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getApplicationsByJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobId } = req.params;

        const applications = await prisma.application.findMany({
            where: { jobPostingId: jobId },
            orderBy: { appliedAt: 'desc' },
        });

        res.json(applications);
    } catch (error) {
        console.error('Get applications by job error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                jobPosting: {
                    select: {
                        title: true,
                        department: true,
                    },
                },
            },
        });

        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }

        res.json(application);
    } catch (error) {
        console.error('Get application by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            res.status(400).json({ message: 'Status is required' });
            return;
        }

        const application = await prisma.application.findUnique({
            where: { id },
        });

        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }

        const updatedApplication = await prisma.application.update({
            where: { id },
            data: {
                status,
                reviewedAt: new Date(),
            },
        });

        res.json({
            message: 'Application status updated successfully',
            application: updatedApplication,
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
