import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface PageInfo {
    title: string;
    subtitle: string;
}

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    isLargeScreen = true;
    isSidenavOpened = true;
    totalSpent$: Observable<number>;
    thisMonthSpent$: Observable<number>;

    pageTitle = 'Dashboard';
    pageSubtitle = 'Overview of your finances';

    private pageMap: { [key: string]: PageInfo } = {
        '/dashboard': {
            title: 'Dashboard',
            subtitle: 'Overview of your finances'
        },
        '/expenses': {
            title: 'Expenses',
            subtitle: 'Track and manage your spending'
        },
        '/categories': {
            title: 'Categories',
            subtitle: 'Organize your expense types'
        }
    };

    constructor(
        private router: Router,
        private dataService: DataService
    ) {
        this.totalSpent$ = this.dataService.getExpenses().pipe(
            map(expenses => expenses.reduce((sum, exp) => sum + exp.amount, 0))
        );

        this.thisMonthSpent$ = this.dataService.getExpenses().pipe(
            map(expenses => {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                return expenses
                    .filter(exp => {
                        const expDate = new Date(exp.date);
                        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
                    })
                    .reduce((sum, exp) => sum + exp.amount, 0);
            })
        );

        // Listen to route changes and update page title
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updatePageInfo(event.urlAfterRedirects);
        });
    }

    ngOnInit(): void {
        this.checkScreenSize();
        this.updatePageInfo(this.router.url);
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.checkScreenSize();
    }

    private checkScreenSize(): void {
        this.isLargeScreen = window.innerWidth >= 1024;
        this.isSidenavOpened = this.isLargeScreen;
    }

    private updatePageInfo(url: string): void {
        const pageInfo = this.pageMap[url] || this.pageMap['/dashboard'];
        this.pageTitle = pageInfo.title;
        this.pageSubtitle = pageInfo.subtitle;
    }

    toggleSidenav(): void {
        this.isSidenavOpened = !this.isSidenavOpened;
    }

    logout(): void {
        this.router.navigate(['/login']);
    }
}
