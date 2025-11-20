import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../core/services/data.service';
import { Category, Expense } from '../../../core/models/models';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { combineLatest } from 'rxjs';

interface ExpenseWithCategory extends Expense {
    categoryName: string;
    categoryColor?: string;
    categoryIcon?: string;
}

@Component({
    selector: 'app-expense-list',
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
    displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'actions'];
    dataSource = new MatTableDataSource<ExpenseWithCategory>([]);
    categories: Category[] = [];

    // Filters
    filterCategoryId: number | null = null;
    filterStartDate: Date | null = null;
    filterEndDate: Date | null = null;
    sortBy = 'date';
    sortOrder = 'desc';

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private dataService: DataService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        combineLatest([
            this.dataService.getExpenses(),
            this.dataService.getCategories()
        ]).subscribe(([expenses, categories]) => {
            this.categories = categories;
            const enrichedExpenses = expenses.map(expense => {
                const category = categories.find(c => c.id === expense.categoryId);
                return {
                    ...expense,
                    categoryName: category ? category.name : 'Unknown',
                    categoryColor: category ? category.color : '#ccc',
                    categoryIcon: category ? category.icon : 'help'
                };
            });
            this.dataSource.data = enrichedExpenses;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            // Custom filter predicate
            this.dataSource.filterPredicate = (data: ExpenseWithCategory, filter: string) => {
                const searchStr = filter.toLowerCase();
                const matchesSearch = data.description.toLowerCase().includes(searchStr) ||
                    data.categoryName.toLowerCase().includes(searchStr);

                const matchesCategory = this.filterCategoryId ? data.categoryId === this.filterCategoryId : true;

                let matchesDate = true;
                if (this.filterStartDate && this.filterEndDate) {
                    const expenseDate = new Date(data.date);
                    matchesDate = expenseDate >= this.filterStartDate && expenseDate <= this.filterEndDate;
                }

                return matchesSearch && matchesCategory && matchesDate;
            };
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyCategoryFilter(categoryId: number | null): void {
        this.filterCategoryId = categoryId;
        this.dataSource.filter = this.dataSource.filter || ' '; // Trigger filter
    }

    applyDateFilter(): void {
        this.dataSource.filter = this.dataSource.filter || ' '; // Trigger filter
    }

    clearFilters(): void {
        this.filterCategoryId = null;
        this.filterStartDate = null;
        this.filterEndDate = null;
        this.dataSource.filter = '';
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    exportData(): void {
        console.log('Exporting data...');
        alert('Export feature coming soon!');
    }

    openDialog(expense?: Expense): void {
        const dialogRef = this.dialog.open(ExpenseDialogComponent, {
            width: '450px',
            data: expense ? { ...expense } : null
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.id) {
                    this.dataService.updateExpense(result);
                } else {
                    this.dataService.addExpense(result);
                }
            }
        });
    }

    deleteExpense(id: number): void {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.dataService.deleteExpense(id);
        }
    }

    getCategoryColor(categoryId: number): string {
        const cat = this.categories.find(c => c.id === categoryId);
        return cat ? cat.color || '#ccc' : '#ccc';
    }

    getCategoryIcon(categoryId: number): string {
        const cat = this.categories.find(c => c.id === categoryId);
        return cat ? cat.icon || 'category' : 'category';
    }
}
