import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Subject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";

import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";
import { throwMatDialogContentAlreadyAttachedError } from "@angular/material/dialog";

@Injectable() 
export class AuthService {
    authChange = new Subject<boolean>(); 
    private isAuthenticated = false; 

    constructor(
        private router: Router, 
        private afAuth: AngularFireAuth, 
        private trainingServise: TrainingService, 
        private uiService: UIService
    ) {}

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true; 
                this.authChange.next(true); 
                this.router.navigate(['/training']);
            } else {
                this.trainingServise.cancelSubscriptions(); 
                this.authChange.next(false); 
                this.router.navigate(['/login']); 
                this.isAuthenticated = false; 
            }
        });
    }
    
    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.createUserWithEmailAndPassword(
            authData.email, 
            authData.password
        ).then((result: any) => {
            this.uiService.loadingStateChanged.next(false);
        })
        .catch((error: any) => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error.message, undefined, 3000);
        });
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true); 
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then( result => {
            this.uiService.loadingStateChanged.next(false);
        })
        .catch(error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(error, undefined, 3000);
        });
    }

    logout() {
        this.afAuth.signOut(); // this.afAuth.auth.signOut(); 
    }

    isAuth() { 
        return this.isAuthenticated; 
    }

}