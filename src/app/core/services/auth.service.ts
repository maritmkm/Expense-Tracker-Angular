import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    constructor() {
        // Check local storage for existing session (mock)
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
            this.isLoggedInSubject.next(true);
        }
    }

    login(username: string, password: string): Observable<User> {
        // Mock login - accept any non-empty credentials
        // In a real app, you'd call an API
        const mockUser: User = {
            id: 1,
            username: username,
            email: `${username}@example.com`,
            fullName: 'Demo User'
        };

        return of(mockUser).pipe(
            delay(1000), // Simulate network delay
            tap(user => {
                this.currentUserSubject.next(user);
                this.isLoggedInSubject.next(true);
                localStorage.setItem('currentUser', JSON.stringify(user));
            })
        );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.isLoggedInSubject.next(false);
    }

    isAuthenticated(): boolean {
        return this.isLoggedInSubject.value;
    }
}
