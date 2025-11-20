import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseDialogComponent } from './expense-dialog/expense-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
const routes: Routes = [
    { path: '', component: ExpenseListComponent }
];

@NgModule({
    declarations: [
        ExpenseListComponent,
        ExpenseDialogComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes), MatDialogModule, MatIconModule
    ]
})
export class ExpensesModule { }
