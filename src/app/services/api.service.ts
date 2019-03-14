import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {interval} from "rxjs/internal/observable/interval";
import {startWith, switchMap} from "rxjs/operators";
import {throwError} from 'rxjs';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Session} from '../models/session';
import {Event} from '../models/event';
import {Command, CommandResponse} from '../models/command';

const POLLING_INTERVAL = 1000;
const NUM_EVENTS       = 50;

const API_SCHEMA = 'http';
const API_HOST   = document.location.hostname;
const API_PORT   = 8081;
const API_URL    = API_SCHEMA + '://' + API_HOST + ':' + API_PORT + '/api';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public isLogged: boolean = false;
    public error: Response | any;
    private user: string;
    private pass: string;
    private headers: HttpHeaders;

    public session: Session;
    public events: Event[] = [];

    public onNewData: EventEmitter<Session> = new EventEmitter();
    public onNewEvents: EventEmitter<Event[]> = new EventEmitter();
    public onLoggedOut: EventEmitter<any> = new EventEmitter();
    public onLoggedIn: EventEmitter<any> = new EventEmitter();
    public onError: EventEmitter<any> = new EventEmitter();

    constructor(private http:HttpClient) {}

    public pollEvents() {
        console.log("api.pollEvents() started");
        return interval(POLLING_INTERVAL)
            .pipe(
                startWith(0),
                switchMap(() => this.getEvents())
            );
    }

    public pollSession() {
        console.log("api.pollSession() started");
        return interval(POLLING_INTERVAL)
            .pipe(
                startWith(0),
                switchMap(() => this.getSession())
            );
    }

    public login(username: string, password: string) {
        console.log("api.login()");
        this.user = username;
        this.pass = password;
        this.headers = new HttpHeaders().set("Authorization", "Basic " + btoa(this.user+":"+this.pass));
        return this.getSession();
    }

    public loadCreds() {
        let auth = localStorage.getItem('auth');
        if(auth) {
            console.log("found localStorage credentials");
            let creds = JSON.parse(auth);
            this.login(creds.username, creds.password).subscribe((session) => {
                this.session = session;  
            });
        } else {
            console.log("no creds found");
            this.session = null;
            this.isLogged = false;
            this.onLoggedOut.emit(null);
        }
    }

    private clearCreds() {
        console.log("api.clearCreds()");
        this.headers = null;
        this.user = "";
        this.pass = "";
        localStorage.removeItem('auth');
    }

    private saveCreds() {
        // console.log("api.saveCreds()");
        localStorage.setItem('auth', JSON.stringify({
            username: this.user,
            password: this.pass,
        }));
        this.isLogged = true;
    }

    public logout() {
        if( this.isLogged ) {
            console.log("api.logout()");
            this.clearCreds();
            this.isLogged = false;
        } else {
            console.log("api.logout() but isLogged=false");
        }
    }

    public getEvents() : Observable<Event[]> {
        return this.http
        .get<Event[]>( API_URL + '/events', 
        {
            headers: this.headers,
            params: {'n': String(NUM_EVENTS)}
        })
        .map(response => {
            this.events = response;
            this.onNewEvents.emit(response);
            return response;
        })
        .catch(error => {
            return throwError(error);
        });
    }

    public clearEvents() {
        console.log("clearing events");
        this.http
        .delete( API_URL + '/events', {headers: this.headers})
        .subscribe(response => {
            this.events = [];
            this.onNewEvents.emit([]);
        }, error => {
            return throwError(error);
        });
    }

    public isModuleEnabled(name: string) : boolean {
        if(this.session && this.session.modules) {
            for( let i = 0; i < this.session.modules.length; i++ ) {
                let mod = this.session.modules[i];
                if( mod.name == name )
                    return mod.running;
            }
        }
        return false;
    }

    public getSession() : Observable<Session> {
        return this.http
        .get<Session>( API_URL + '/session', {headers: this.headers})
        .map(response => {
            let wasLogged = this.isLogged;

            this.saveCreds();
            this.session = response;

            if(wasLogged == false) {
                console.log("loggedin.emit");
                this.onLoggedIn.emit();
            }

            this.onNewData.emit(response);
            return response;
        })
        .catch(error => {
            this.error = error;

            if( error.status == 401 ) {
                this.logout();
                console.log("loggedout.emit");
                this.onLoggedOut.emit(error);
            } else {
                console.log("error.emit");
                this.onError.emit(error);
            }
            return throwError(error);
        });
    }

    public cmd(cmd: string) {
        console.log("cmd: " + cmd);
        return this.http.post<CommandResponse>(
            API_URL + '/session', 
            {cmd: cmd},
            {headers: this.headers})
            .subscribe(
                (val) => {},
                response => {},
                () => {}); 
    }
}
