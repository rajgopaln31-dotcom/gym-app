export type View = 'dash' | 'members' | 'classes' | 'pay';
export type Plan = 'Monthly' | 'Quarterly' | 'Annual' | 'Student';
export type Status = 'active' | 'expiring' | 'expired';
export type StatusFilter = 'all' | Status;
export type PayStatus = 'due' | 'overdue' | 'paid';

export interface Member {
  id: number;
  n: string;
  p: Plan;
  e: string;
  in: string;
}
export interface GymClass {
  id: number;
  n: string;
  t: string;
  c: string;
  cap: number;
  b: number;
}
export interface Payment {
  id: number;
  m: string;
  a: number;
  d: string;
  s: PayStatus;
}
export interface FeedItem {
  t: Date;
  x: string;
}

export const D = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const CAP = 40;
export const PLANS: Plan[] = ['Monthly', 'Quarterly', 'Annual', 'Student'];
export const PRICE: Record<Plan, number> = { Monthly: 1500, Quarterly: 3900, Annual: 13500, Student: 900 };

export const initialMembers = (): Member[] => [
  { id: 1, n: 'Ananya Reddy', p: 'Annual', e: D(210), in: 'Today, 6:10 AM' },
  { id: 2, n: 'Karthik Naidu', p: 'Monthly', e: D(5), in: 'Yesterday' },
  { id: 3, n: 'Meera Subramanian', p: 'Quarterly', e: D(48), in: 'Today, 7:45 AM' },
  { id: 4, n: 'Rohit Varma', p: 'Monthly', e: D(-6), in: '9 days ago' },
  { id: 5, n: 'Sana Sheikh', p: 'Student', e: D(22), in: 'Today, 5:30 PM' },
  { id: 6, n: 'Vikram Rao', p: 'Annual', e: D(130), in: '2 days ago' },
  { id: 7, n: 'Lakshmi Prasad', p: 'Monthly', e: D(2), in: 'Today, 6:50 AM' },
  { id: 8, n: 'Arjun Mehta', p: 'Quarterly', e: D(-1), in: '4 days ago' },
];

export const initialClasses = (): GymClass[] => [
  { id: 1, n: 'Morning HIIT', t: 'Mon–Fri · 6:00 AM', c: 'Coach Dev', cap: 20, b: 17 },
  { id: 2, n: 'Strength basics', t: 'Tue, Thu · 7:30 AM', c: 'Coach Priya', cap: 12, b: 12 },
  { id: 3, n: 'Yoga flow', t: 'Daily · 6:30 PM', c: 'Coach Nisha', cap: 25, b: 14 },
  { id: 4, n: 'Spin ride', t: 'Wed, Sat · 8:00 AM', c: 'Coach Ravi', cap: 15, b: 9 },
];

export const initialPayments = (): Payment[] => [
  { id: 1, m: 'Karthik Naidu', a: 1500, d: D(5), s: 'due' },
  { id: 2, m: 'Rohit Varma', a: 1500, d: D(-6), s: 'overdue' },
  { id: 3, m: 'Arjun Mehta', a: 3900, d: D(-1), s: 'overdue' },
  { id: 4, m: 'Lakshmi Prasad', a: 1500, d: D(2), s: 'due' },
  { id: 5, m: 'Meera Subramanian', a: 3900, d: D(-30), s: 'paid' },
  { id: 6, m: 'Sana Sheikh', a: 900, d: D(-8), s: 'paid' },
];

export const INITIAL_INSIDE = [1, 3, 7];
export const INITIAL_WEEK = [62, 88, 74, 95, 81, 58, 43];

export const days = (e: string): number =>
  Math.round((new Date(e).getTime() - new Date(D(0)).getTime()) / 864e5);

export const status = (m: Member): Status => {
  const d = days(m.e);
  return d < 0 ? 'expired' : d <= 7 ? 'expiring' : 'active';
};

export const fmt = (e: string): string =>
  new Date(e).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const inr = (n: number): string => '₹' + n.toLocaleString('en-IN');

export const hms = (d: Date): string =>
  d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
