const DAY = 86400000;

export class DateUtils {
  static startOfDay(date = new Date()): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static daysFromToday(endDate: Date): number {
    return Math.max(
      Math.ceil((this.startOfDay(endDate).getTime() - this.startOfDay().getTime()) / DAY),
      1
    );
  }
}
