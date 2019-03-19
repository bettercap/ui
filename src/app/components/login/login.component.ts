import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

import * as urlParse from 'url-parse';

@Component({
    selector: 'hydra-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    submitted: boolean = false;
    error: any;
    subscriptions: any = [];

    constructor(private api: ApiService, private formBuilder: FormBuilder, private router: Router) {
        if( this.api.isLogged ) {
            console.log("user already logged in");
            this.router.navigateByUrl("/");
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            url:      [this.api.URL(), Validators.required]
        });

        this.subscriptions = [
            this.api.onSessionError.subscribe(error => {
                this.error = error;
            }),
            this.api.onLoggedOut.subscribe(error => {
                this.error = error;
            }),
            this.api.onLoggedIn.subscribe(() => {
                this.router.navigateByUrl("/");
            })
        ];
    }

    ngOnDestroy() {
        for( let i = 0; i < this.subscriptions.length; i++ ){
            this.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];
    }

    get form() { 
        return this.loginForm.controls; 
    }

    onSubmit() {
        this.submitted = true;
        if( !this.loginForm.invalid ) {
            let parsed = urlParse(this.form.url.value, false);

            this.api.schema = parsed.protocol;
            this.api.host = parsed.hostname;
            this.api.port = parsed.port;
            this.api.path = parsed.pathname;

            this.api
            .login(this.form.username.value, this.form.password.value)
            .subscribe(
                (value) => {},
                (error) => { this.error = error; }
            );
        }
    }
}
