import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false; 
  private loadingSubs!: Subscription; 

  constructor(private authService: AuthService, private uiService: UIService) { }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading; 
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', { 
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required]})
    });
  }

  /* onSubmit(form: NgForm) {
    console.log(form);
  } */

  onSubmit(){
    this.authService.login({
      email: this.loginForm.value.email, 
      password: this.loginForm.value.password
    });
  }

  ngOnDestroy(): void {
    if(this.loadingSubs) {
      this.loadingSubs.unsubscribe(); 
    }
  }

}
