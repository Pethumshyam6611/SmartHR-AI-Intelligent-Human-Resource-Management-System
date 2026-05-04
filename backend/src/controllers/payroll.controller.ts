import type { Request, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../config/database';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { getWorkingDaysInMonth } from '../utils/dateHelpers';
import { notifyUsers } from '../services/notification.service';

const toAmount = (value: unknown) => Number(Number(value ?? 0).toFixed(2));

const canAccessPayroll = async (req: Request, payrollEmployeeId: string) => {
  if (!req.user) {
    return false;
  }

  if (req.user.role === Role.ADMIN || req.user.role === Role.HR_MANAGER) {
    return true;
  }

  return req.user.employeeId === payrollEmployeeId;
};

export const generatePayroll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, month, year, allowances = 0, deductions = 0 } = req.body;

    if (!employeeId || !month || !year) {
      res.status(400).json({ message: 'Employee ID, month, and year are required' });
      return;
    }

    const payrollMonth = Number(month);
    const payrollYear = Number(year);

    const existingPayroll = await prisma.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month: payrollMonth,
          year: payrollYear,
        },
      },
    });

    if (existingPayroll) {
      res.status(400).json({ message: 'Payroll already generated for this period' });
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

    const startDate = new Date(payrollYear, payrollMonth - 1, 1);
    const endDate = new Date(payrollYear, payrollMonth, 1);

    const attendances = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const workingDays = getWorkingDaysInMonth(payrollYear, payrollMonth);
    const presentDays = attendances.filter((attendance) => Boolean(attendance.clockIn)).length;
    const totalOvertimeHours = attendances.reduce((sum, att) => sum + (att.overtimeHours || 0), 0);

    const baseSalary = Number(employee.salary);
    const dailyRate = workingDays > 0 ? baseSalary / workingDays : 0;
    const hourlyRate = dailyRate / 8;
    const absenceDays = Math.max(0, workingDays - presentDays);
    const absenceDeduction = dailyRate * absenceDays;
    const overtimePay = hourlyRate * totalOvertimeHours;
    const manualAllowances = toAmount(allowances);
    const manualDeductions = toAmount(deductions);
    const totalDeductions = toAmount(absenceDeduction + manualDeductions);
    const netSalary = toAmount(baseSalary + overtimePay + manualAllowances - totalDeductions);

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        month: payrollMonth,
        year: payrollYear,
        baseSalary,
        overtimePay: toAmount(overtimePay),
        allowances: manualAllowances,
        deductions: totalDeductions,
        netSalary,
        workingDays,
        presentDays,
        overtimeHours: Number(totalOvertimeHours.toFixed(2)),
      },
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
    });

    await notifyUsers(
      employee.user?.id ? [employee.user.id] : [],
      'Payroll generated',
      `Your payroll for ${payrollMonth}/${payrollYear} is ready to view and download.`,
      'payroll_generated'
    );

    res.json({
      message: 'Payroll generated successfully',
      payroll,
    });
  } catch (error) {
    console.error('Generate payroll error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyPayroll = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      res.status(400).json({ message: 'Employee ID not found' });
      return;
    }

    const payrolls = await prisma.payroll.findMany({
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
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    res.json(payrolls);
  } catch (error) {
    console.error('Get my payroll error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPayrolls = async (_req: Request, res: Response): Promise<void> => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true,
          },
        },
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    res.json(payrolls);
  } catch (error) {
    console.error('Get all payrolls error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployeePayroll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.params;

    const payrolls = await prisma.payroll.findMany({
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
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    res.json(payrolls);
  } catch (error) {
    console.error('Get employee payroll error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const downloadSalarySlip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const payroll = await prisma.payroll.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!payroll) {
      res.status(404).json({ message: 'Payroll not found' });
      return;
    }

    if (!(await canAccessPayroll(req, payroll.employeeId))) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    const doc = new PDFDocument();
    const fileName = `salary-slip-${payroll.employeeId}-${payroll.month}-${payroll.year}.pdf`;
    const uploadsDir = path.join(process.cwd(), 'uploads', 'payroll');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    doc.fontSize(20).text('Salary Slip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Employee: ${payroll.employee.firstName} ${payroll.employee.lastName}`);
    doc.text(`Position: ${payroll.employee.position ?? 'N/A'}`);
    doc.text(`Department: ${payroll.employee.department ?? 'N/A'}`);
    doc.text(`Email: ${payroll.employee.user.email}`);
    doc.text(`Period: ${payroll.month}/${payroll.year}`);
    doc.moveDown();
    doc.text(`Working Days: ${payroll.workingDays}`);
    doc.text(`Present Days: ${payroll.presentDays}`);
    doc.text(`Overtime Hours: ${payroll.overtimeHours}`);
    doc.moveDown();
    doc.text(`Base Salary: $${payroll.baseSalary}`);
    doc.text(`Overtime Pay: $${payroll.overtimePay}`);
    doc.text(`Allowances: $${payroll.allowances}`);
    doc.text(`Deductions: $${payroll.deductions}`);
    doc.moveDown();
    doc.fontSize(14).text(`Net Salary: $${payroll.netSalary}`, { underline: true });

    doc.end();

    writeStream.on('finish', async () => {
      await prisma.payroll.update({
        where: { id },
        data: { pdfPath: filePath },
      });

      res.download(filePath, fileName);
    });

    writeStream.on('error', (error) => {
      console.error('PDF generation error:', error);
      res.status(500).json({ message: 'Failed to generate PDF' });
    });
  } catch (error) {
    console.error('Download salary slip error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
