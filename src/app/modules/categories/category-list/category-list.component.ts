import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../core/services/data.service';
import { Category } from '../../../core/models/models';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
    categories$: Observable<any[]>;

    constructor(
        private dataService: DataService,
        private dialog: MatDialog
    ) {
        this.categories$ = this.dataService.getCategoryStats();
    }

    ngOnInit(): void { }

    openDialog(category?: Category): void {
        const dialogRef = this.dialog.open(CategoryDialogComponent, {
            width: '400px',
            data: category ? { ...category } : null
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.id) {
                    this.dataService.updateCategory(result);
                } else {
                    this.dataService.addCategory(result);
                }
            }
        });
    }

    deleteCategory(id: number): void {
        if (confirm('Are you sure you want to delete this category?')) {
            this.dataService.deleteCategory(id);
        }
    }
}
