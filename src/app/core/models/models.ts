export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string; // Material icon name
  color?: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: Date;
  categoryId: number;
  categoryName?: string; // For display convenience
}
