import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Category, Expense } from '../../core/models/models';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    totalExpenses$: Observable<number>;
    todayExpenses$: Observable<number>;
    avgDailySpend$: Observable<number>;
    categoryStats$: Observable<any[]>;
    monthlyTrend$: Observable<any[]>;

    constructor(private dataService: DataService) {
        this.totalExpenses$ = this.dataService.getExpenses().pipe(
            map(expenses => expenses.reduce((acc, curr) => acc + curr.amount, 0))
        );

        this.todayExpenses$ = this.dataService.getExpenses().pipe(
            map(expenses => {
                const today = new Date();
                return expenses
                    .filter(e => new Date(e.date).toDateString() === today.toDateString())
                    .reduce((acc, curr) => acc + curr.amount, 0);
            })
        );

        this.avgDailySpend$ = this.dataService.getAverageDailySpend();
        this.categoryStats$ = this.dataService.getCategoryStats();
        this.monthlyTrend$ = this.dataService.getMonthlyTrend();
    }

    ngOnInit(): void { }

    getPercentage(value: number, total: number): number {
        return total > 0 ? (value / total) * 100 : 0;
    }
}
