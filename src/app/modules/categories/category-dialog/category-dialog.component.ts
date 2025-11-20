import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../core/models/models';

@Component({
    selector: 'app-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {
    form: FormGroup;
    isEditMode: boolean;

    // Predefined icons for selection
    icons = ['restaurant', 'directions_car', 'movie', 'build', 'shopping_cart', 'home', 'flight', 'medical_services'];

    // Predefined colors
    colors = ['#FF5722', '#2196F3', '#9C27B0', '#607D8B', '#E91E63', '#4CAF50', '#FFC107', '#795548'];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Category
    ) {
        this.isEditMode = !!data;
        this.form = this.fb.group({
            id: [data?.id || null],
            name: [data?.name || '', Validators.required],
            icon: [data?.icon || 'category'],
            color: [data?.color || '#607D8B']
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
