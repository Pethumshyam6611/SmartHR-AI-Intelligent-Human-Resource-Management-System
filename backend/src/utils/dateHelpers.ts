/**
 * Calculate working hours between two timestamps
 */
export const calculateWorkingHours = (clockIn: Date, clockOut: Date): number => {
  const diffMs = clockOut.getTime() - clockIn.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.max(0, diffHours);
};

/**
 * Calculate overtime hours (hours beyond 8 hours standard workday)
 */
export const calculateOvertimeHours = (workingHours: number): number => {
  const standardHours = 8;
  return Math.max(0, workingHours - standardHours);
};

/**
 * Get number of working days in a month
 */
export const getWorkingDaysInMonth = (year: number, month: number): number => {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    // Count Monday-Friday as working days
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
};

/**
 * Calculate number of days between two dates (inclusive)
 */
export const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};
