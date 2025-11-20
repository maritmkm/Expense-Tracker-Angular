import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Category, Expense } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private categories: Category[] = [
        { id: 1, name: 'Food', icon: 'restaurant', color: '#FF5722' },
        { id: 2, name: 'Transport', icon: 'directions_car', color: '#2196F3' },
        { id: 3, name: 'Entertainment', icon: 'movie', color: '#9C27B0' },
        { id: 4, name: 'Utilities', icon: 'build', color: '#607D8B' },
        { id: 5, name: 'Shopping', icon: 'shopping_cart', color: '#E91E63' }
    ];

    private expenses: Expense[] = [
        { id: 1, description: 'Lunch', amount: 15.50, date: new Date(), categoryId: 1 },
        { id: 2, description: 'Uber', amount: 25.00, date: new Date(), categoryId: 2 },
        { id: 3, description: 'Groceries', amount: 85.20, date: new Date(new Date().setDate(new Date().getDate() - 1)), categoryId: 1 },
        { id: 4, description: 'Internet Bill', amount: 60.00, date: new Date(new Date().setDate(new Date().getDate() - 2)), categoryId: 4 }
    ];

    private categoriesSubject = new BehaviorSubject<Category[]>(this.categories);
    private expensesSubject = new BehaviorSubject<Expense[]>(this.expenses);

    constructor() { }

    // Categories
    getCategories(): Observable<Category[]> {
        return this.categoriesSubject.asObservable();
    }

    addCategory(category: Category): void {
        category.id = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) + 1 : 1;
        this.categories.push(category);
        this.categoriesSubject.next([...this.categories]);
    }

    updateCategory(category: Category): void {
        const index = this.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
            this.categories[index] = category;
            this.categoriesSubject.next([...this.categories]);
        }
    }

    deleteCategory(id: number): void {
        this.categories = this.categories.filter(c => c.id !== id);
        this.categoriesSubject.next([...this.categories]);
    }

    // Expenses
    getExpenses(): Observable<Expense[]> {
        // Enrich expenses with category names for display if needed, 
        // but usually we join in the component or use a pipe. 
        // For simplicity, we'll return as is.
        return this.expensesSubject.asObservable();
    }

    addExpense(expense: Expense): void {
        expense.id = this.expenses.length > 0 ? Math.max(...this.expenses.map(e => e.id)) + 1 : 1;
        this.expenses.push(expense);
        this.expensesSubject.next([...this.expenses]);
    }

    updateExpense(expense: Expense): void {
        const index = this.expenses.findIndex(e => e.id === expense.id);
        if (index !== -1) {
            this.expenses[index] = expense;
            this.expensesSubject.next([...this.expenses]);
        }
    }

    deleteExpense(id: number): void {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.expensesSubject.next([...this.expenses]);
    }

    // Analytics
    getAverageDailySpend(): Observable<number> {
        // Mock calculation: Total spend / 30 days
        const total = this.expenses.reduce((acc, curr) => acc + curr.amount, 0);
        return of(total / 30);
    }

    getCategoryStats(): Observable<any[]> {
        const stats = this.categories.map(cat => {
            const catExpenses = this.expenses.filter(e => e.categoryId === cat.id);
            const total = catExpenses.reduce((acc, curr) => acc + curr.amount, 0);
            const count = catExpenses.length;
            const avg = count > 0 ? total / count : 0;
            return { ...cat, total, count, avg };
        });
        return of(stats);
    }

    getMonthlyTrend(): Observable<any[]> {
        // Mock data for chart
        return of([
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 550 },
            { name: 'Apr', value: 450 },
            { name: 'May', value: 600 },
            { name: 'Jun', value: 700 }
        ]);
    }
}
