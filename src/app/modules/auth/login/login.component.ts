import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    hidePassword = true;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const { username, password } = this.loginForm.value;

            // Simulate network delay for better UX
            setTimeout(() => {
                if (this.authService.login(username, password)) {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.snackBar.open('Invalid credentials', 'Close', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        panelClass: ['error-snackbar']
                    });
                    this.isLoading = false;
                }
            }, 800);
        }
    }
}
