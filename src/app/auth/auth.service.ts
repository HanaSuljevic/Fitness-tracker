import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";
import { User } from "./user.model";

@Injectable() 
export class AuthService {
    authChange = new Subject<boolean>(); 
    private user!: User | null;

    constructor(private router: Router) {}
    
    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email, 
            userId: Math.round(Math.random() * 10000).toString()
        };
        this.
        authSuccessfully();
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email, 
            userId: Math.round(Math.random() * 10000).toString() 
        };
        this.authSuccessfully();
    }

    logout() {
        this.user = null;
        this.authChange.next(false);
        this.router.navigate(['/login'])
    }

    getUser() {
        return { ...this.user }; 
    }

    isAuth() { 
        console.log('usr', this.user)
        if(this.user != null)
            return true 
        else 
            return false; 
    }

    private authSuccessfully() {
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }
}