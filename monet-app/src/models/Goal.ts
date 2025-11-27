export interface Goal {
  id?: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}