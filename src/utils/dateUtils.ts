export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(isoStr: string): Date {
  const [y, m, d] = isoStr.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isTodayDate(d: Date): boolean {
  return isSameDay(d, new Date());
}

export function getMonthCalendarGrid(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week for 1st of month: 0 (Sun) to 6 (Sat)
  const startDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const days: CalendarDay[] = [];
  const today = new Date();

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date: d,
      dateString: formatISODate(d),
      dayNumber: d.getDate(),
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
    });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    days.push({
      date: d,
      dateString: formatISODate(d),
      dayNumber: i,
      isCurrentMonth: true,
      isToday: isSameDay(d, today),
    });
  }

  // Next month leading days to complete full weeks (multiple of 7, up to 35 or 42)
  const remainingDays = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingDays; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      date: d,
      dateString: formatISODate(d),
      dayNumber: i,
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
    });
  }

  return days;
}

export function formatMonthName(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}
