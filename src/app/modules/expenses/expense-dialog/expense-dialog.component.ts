import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../core/services/data.service';
import { Category, Expense } from '../../../core/models/models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-expense-dialog',
    templateUrl: './expense-dialog.component.html',
    styleUrls: ['./expense-dialog.component.scss']
})
export class ExpenseDialogComponent implements OnInit {
    form: FormGroup;
    isEditMode: boolean;
    categories$: Observable<Category[]>;

    constructor(
        private fb: FormBuilder,
        private dataService: DataService,
        public dialogRef: MatDialogRef<ExpenseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Expense
    ) {
        this.isEditMode = !!data;
        this.categories$ = this.dataService.getCategories();

        this.form = this.fb.group({
            id: [data?.id || null],
            description: [data?.description || '', Validators.required],
            amount: [data?.amount || null, [Validators.required, Validators.min(0.01)]],
            date: [data?.date || new Date(), Validators.required],
            categoryId: [data?.categoryId || null, Validators.required]
        });
    }

    ngOnInit(): void { }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }

    getSelectedCategoryName(id: number): string {
        return 'Selected Category';
    }
}
