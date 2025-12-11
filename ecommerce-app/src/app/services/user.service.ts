// user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
    id?: string;  // ← Usar string en lugar de number para MongoDB
    username: string;  // ← Solo username, no name
    email: string;
    role?: string;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();




    getCurrentUser(): User {
        const user = this.getUserFromStorage();
        if (!user) {
            return {
                username: 'usuario',  // ← Solo username
                email: 'usuario@ejemplo.com',
                createdAt: new Date().toISOString()
            };
        }
        return user;
    }

    private getUserFromStorage(): User | null {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    setCurrentUser(user: User): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    updateUserProfile(updatedUser: Partial<User>): void {
        const currentUser = this.getCurrentUser();
        const newUser = { ...currentUser, ...updatedUser };
        this.setCurrentUser(newUser as User);
    }
}