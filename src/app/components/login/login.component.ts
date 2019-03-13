import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'hydra-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    submitted: boolean = false;
    error: any;

    constructor(private api: ApiService, private formBuilder: FormBuilder, private router: Router) {
        if( this.api.isLogged ) {
            console.log("user already logged in");
            this.router.navigateByUrl("/");
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.api.onLoggedIn.subscribe(() => {
            this.router.navigateByUrl("/");
        });
    }

    ngOnDestroy() { 
        // this.api.onLoggedIn.unsubscribe();
    }

    get form() { 
        return this.loginForm.controls; 
    }

    onSubmit() {
        this.submitted = true;
        if( !this.loginForm.invalid ) {
            this.api
            .login(this.form.username.value, this.form.password.value)
            .subscribe(
                (value) => {},
                (error) => { this.error = error; }
            );
        }
    }
}
