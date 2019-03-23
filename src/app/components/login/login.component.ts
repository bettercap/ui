import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

import * as urlParse from 'url-parse';

@Component({
    selector: 'ui-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    submitted: boolean = false;
    error: any;
    mismatch: any = null;
    subscriptions: any = [];
    returnTo: string = "/";
    env: any = environment;

    constructor(private api: ApiService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
        console.log("env:", this.env);

        if( this.api.Ready() ) {
            console.log("user already logged in");
            this.router.navigateByUrl("/");
        }
    }

    ngOnInit() {
        this.api.logout();
        this.returnTo = this.route.snapshot.queryParams['returnTo'] || '/';

        this.loginForm = this.formBuilder.group({
            username: [''],
            password: [''],
            url:      [this.api.settings.URL(), Validators.required]
        });

        this.subscriptions = [
            this.api.onSessionError.subscribe(error => {
                console.log(error);
                this.error = error;
                console.log("session error:" + error);
            }),
            this.api.onLoggedOut.subscribe(error => {
                this.error = error;
                console.log("logged out:" + error);
            }),
            this.api.onLoggedIn.subscribe(() => {
                console.log("logged in");
                this.router.navigateByUrl(this.returnTo);
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
        this.error = null;
        this.submitted = true;
        if( !this.loginForm.invalid ) {
            let parsed = urlParse(this.form.url.value, false);

            this.api.settings.schema = parsed.protocol;
            this.api.settings.host = parsed.hostname;
            this.api.settings.port = parsed.port;
            this.api.settings.path = parsed.pathname;

            this.api
            .login(this.form.username.value, this.form.password.value)
            .subscribe(
                (value) => {},
                (error) => { this.error = error; }
            );
        }
    }
}
