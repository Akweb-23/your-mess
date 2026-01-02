export enum UserRole {
  OWNER = 'OWNER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  messId?: string; // Students belong to a mess
}

export interface Mess {
  id: string;
  name: string;
  ownerId: string;
  perMealRate: number;
  currency: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  messId: string;
  joinedAt: string;
}

export interface AttendanceRecord {
  [studentId: string]: boolean; // true = ate, false = skipped
}

export interface DailyAttendance {
  date: string; // YYYY-MM-DD
  messId: string;
  records: AttendanceRecord;
}

export interface MonthlyBill {
  studentId: string;
  studentName: string;
  studentPhone: string;
  totalMeals: number;
  totalAmount: number;
}