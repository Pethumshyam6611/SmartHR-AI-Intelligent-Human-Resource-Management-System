import { Request, Response } from 'express';
import prisma from '../config/database';
import { JobStatus } from '@prisma/client';

export const getAllJobs = async (_req: Request, res: Response): Promise<void> => {
    try {
        const jobs = await prisma.jobPosting.findMany({
            where: {
                status: JobStatus.OPEN,
            },
            orderBy: { postedAt: 'desc' },
        });

        res.json(jobs);
    } catch (error) {
        console.error('Get all jobs error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const job = await prisma.jobPosting.findUnique({
            where: { id },
            include: {
                applications: {
                    select: {
                        id: true,
                        applicantName: true,
                        status: true,
                        appliedAt: true,
                    },
                },
            },
        });

        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        res.json(job);
    } catch (error) {
        console.error('Get job by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, department, description, requirements, salaryRange, location } = req.body;

        if (!title || !department || !description || !requirements) {
            res.status(400).json({ message: 'Required fields are missing' });
            return;
        }

        const job = await prisma.jobPosting.create({
            data: {
                title,
                department,
                description,
                requirements,
                salaryRange,
                location,
                status: JobStatus.OPEN,
            },
        });

        res.json({
            message: 'Job posting created successfully',
            job,
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, department, description, requirements, salaryRange, location, status } = req.body;

        const job = await prisma.jobPosting.findUnique({
            where: { id },
        });

        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        const updatedJob = await prisma.jobPosting.update({
            where: { id },
            data: {
                title,
                department,
                description,
                requirements,
                salaryRange,
                location,
                status,
                closedAt: status === JobStatus.CLOSED ? new Date() : null,
            },
        });

        res.json({
            message: 'Job posting updated successfully',
            job: updatedJob,
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const job = await prisma.jobPosting.findUnique({
            where: { id },
        });

        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        await prisma.jobPosting.delete({
            where: { id },
        });

        res.json({ message: 'Job posting deleted successfully' });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
