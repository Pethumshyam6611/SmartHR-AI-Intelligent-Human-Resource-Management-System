import { LeaveApprovalStage, LeaveStatus, Role } from '@prisma/client';
import type { Request, Response } from 'express';
import prisma from '../config/database';
import { notifyDepartmentHeads, notifyRoles, notifyUsers } from '../services/notification.service';

type AppRequest = Request;

const buildLeaveScope = async (req: AppRequest) => {
  if (!req.user) {
    return null;
  }

  if (req.user.role === Role.ADMIN || req.user.role === Role.HR_MANAGER) {
    return {};
  }

  if (req.user.role === Role.DEPARTMENT_HEAD) {
    const headEmployee = await prisma.employee.findUnique({
      where: { userId: req.user.id },
      select: { department: true },
    });

    return {
      employee: {
        department: headEmployee?.department ?? '__NO_DEPARTMENT__',
      },
    };
  }

  return {
    employeeId: req.user.employeeId,
  };
};

const getEmployeeDisplayName = (firstName?: string | null, lastName?: string | null) =>
  [firstName, lastName].filter(Boolean).join(' ').trim() || 'Employee';

export const applyLeave = async (req: AppRequest, res: Response): Promise<void> => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      res.status(400).json({ message: 'Employee ID not found' });
      return;
    }

    if (!leaveType || !startDate || !endDate || !reason) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      res.status(400).json({ message: 'Invalid leave date range' });
      return;
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: {
          select: { id: true },
        },
      },
    });

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    const overlappingLeave = await prisma.leave.findFirst({
      where: {
        employeeId,
        status: { not: LeaveStatus.REJECTED },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlappingLeave) {
      res.status(400).json({ message: 'An overlapping leave request already exists' });
      return;
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
        status: LeaveStatus.PENDING,
        currentStage: LeaveApprovalStage.DEPARTMENT_HEAD_REVIEW,
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
            userId: true,
          },
        },
      },
    });

    const employeeName = getEmployeeDisplayName(leave.employee?.firstName, leave.employee?.lastName);
    const deptMessage = `${employeeName} submitted a ${leaveType.toLowerCase()} leave request for ${start.toLocaleDateString()} to ${end.toLocaleDateString()}.`;

    await Promise.all([
      notifyDepartmentHeads(
        leave.employee?.department,
        'New leave request pending your approval',
        deptMessage,
        'leave_department_head_review'
      ),
      notifyRoles(
        [Role.HR_MANAGER, Role.ADMIN],
        'Leave request submitted',
        `${employeeName} submitted a leave request. It will move to HR after department approval.`,
        'leave_submitted'
      ),
    ]);

    res.json({
      message: 'Leave application submitted successfully',
      leave,
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyLeaves = async (req: AppRequest, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      res.status(400).json({ message: 'Employee ID not found' });
      return;
    }

    const leaves = await prisma.leave.findMany({
      where: { employeeId },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            position: true,
            department: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json(leaves);
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllLeaves = async (req: AppRequest, res: Response): Promise<void> => {
  try {
    const { status, stage } = req.query;
    const scope = await buildLeaveScope(req);

    if (scope === null) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const whereClause: Record<string, unknown> = { ...scope };

    if (status) {
      whereClause.status = status;
    }

    if (stage) {
      whereClause.currentStage = stage;
    }

    const leaves = await prisma.leave.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json(leaves);
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getLeaveForReview = async (leaveId: string) =>
  prisma.leave.findUnique({
    where: { id: leaveId },
    include: {
      employee: {
        select: {
          id: true,
          userId: true,
          firstName: true,
          lastName: true,
          department: true,
        },
      },
    },
  });

const canDepartmentHeadReview = async (req: AppRequest, department?: string | null) => {
  if (req.user?.role !== Role.DEPARTMENT_HEAD) {
    return false;
  }

  const departmentHead = await prisma.employee.findUnique({
    where: { userId: req.user.id },
    select: { department: true },
  });

  return Boolean(department && departmentHead?.department === department);
};

export const approveLeave = async (req: AppRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewComments } = req.body;
    const reviewerId = req.user?.id;

    if (!reviewerId || !req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const leave = await getLeaveForReview(id);

    if (!leave) {
      res.status(404).json({ message: 'Leave not found' });
      return;
    }

    if (leave.status !== LeaveStatus.PENDING) {
      res.status(400).json({ message: 'Leave has already been reviewed' });
      return;
    }

    const employeeName = getEmployeeDisplayName(leave.employee?.firstName, leave.employee?.lastName);

    if (leave.currentStage === LeaveApprovalStage.DEPARTMENT_HEAD_REVIEW) {
      const isDepartmentHead = await canDepartmentHeadReview(req, leave.employee?.department);

      if (!isDepartmentHead) {
        res.status(403).json({ message: 'Only the relevant department head can approve this leave at this stage' });
        return;
      }

      const updatedLeave = await prisma.leave.update({
        where: { id },
        data: {
          currentStage: LeaveApprovalStage.HR_REVIEW,
          departmentHeadReviewedBy: reviewerId,
          departmentHeadReviewedAt: new Date(),
          departmentHeadComments: reviewComments,
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              department: true,
              position: true,
            },
          },
        },
      });

      await Promise.all([
        notifyRoles(
          [Role.HR_MANAGER, Role.ADMIN],
          'Leave request moved to HR review',
          `${employeeName}'s leave request is now waiting for HR approval.`,
          'leave_hr_review'
        ),
        notifyUsers(
          leave.employee?.userId ? [leave.employee.userId] : [],
          'Leave request updated',
          'Your leave request was approved by the department head and is now waiting for HR review.',
          'leave_department_approved'
        ),
      ]);

      res.json({
        message: 'Leave approved by department head and sent to HR',
        leave: updatedLeave,
      });
      return;
    }

    if (req.user.role !== Role.HR_MANAGER && req.user.role !== Role.ADMIN) {
      res.status(403).json({ message: 'Only HR manager or admin can finalize this leave request' });
      return;
    }

    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: {
        status: LeaveStatus.APPROVED,
        currentStage: LeaveApprovalStage.COMPLETED,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewComments,
        hrReviewedBy: reviewerId,
        hrReviewedAt: new Date(),
        hrReviewComments: reviewComments,
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
            position: true,
          },
        },
      },
    });

    await notifyUsers(
      leave.employee?.userId ? [leave.employee.userId] : [],
      'Leave approved',
      `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} was approved.`,
      'leave_approved'
    );

    res.json({
      message: 'Leave approved successfully',
      leave: updatedLeave,
    });
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectLeave = async (req: AppRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reviewComments } = req.body;
    const reviewerId = req.user?.id;

    if (!reviewerId || !req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const leave = await getLeaveForReview(id);

    if (!leave) {
      res.status(404).json({ message: 'Leave not found' });
      return;
    }

    if (leave.status !== LeaveStatus.PENDING) {
      res.status(400).json({ message: 'Leave has already been reviewed' });
      return;
    }

    const isDepartmentHeadStage = leave.currentStage === LeaveApprovalStage.DEPARTMENT_HEAD_REVIEW;

    if (isDepartmentHeadStage) {
      const isDepartmentHead = await canDepartmentHeadReview(req, leave.employee?.department);

      if (!isDepartmentHead) {
        res.status(403).json({ message: 'Only the relevant department head can reject this leave at this stage' });
        return;
      }
    } else if (req.user.role !== Role.HR_MANAGER && req.user.role !== Role.ADMIN) {
      res.status(403).json({ message: 'Only HR manager or admin can reject this leave at this stage' });
      return;
    }

    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: {
        status: LeaveStatus.REJECTED,
        currentStage: LeaveApprovalStage.COMPLETED,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewComments,
        ...(isDepartmentHeadStage
          ? {
              departmentHeadReviewedBy: reviewerId,
              departmentHeadReviewedAt: new Date(),
              departmentHeadComments: reviewComments,
            }
          : {
              hrReviewedBy: reviewerId,
              hrReviewedAt: new Date(),
              hrReviewComments: reviewComments,
            }),
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            department: true,
            position: true,
          },
        },
      },
    });

    await notifyUsers(
      leave.employee?.userId ? [leave.employee.userId] : [],
      'Leave rejected',
      `Your leave request was rejected${reviewComments ? `: ${reviewComments}` : '.'}`,
      'leave_rejected'
    );

    res.json({
      message: 'Leave rejected successfully',
      leave: updatedLeave,
    });
  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
