import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {interval} from "rxjs/internal/observable/interval";
import {startWith, switchMap} from "rxjs/operators";
import {from} from 'rxjs';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Session} from '../models/session';
import {Event} from '../models/event';
import {Command, Response} from '../models/command';
import { environment } from '../../environments/environment';

import compareVersions from 'compare-versions';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public schema: string    = 'http:';
    public host: string      = document.location.hostname;
    public port: string      = "8081";
    public path: string      = '/api';
    public interval: number  = 1000;
    public numEvents: number = 25;

    public isLogged: boolean = false;
    public error: Response | any;
    private user: string;
    private pass: string;
    private headers: HttpHeaders;
    private start: Date = new Date();
    private end: Date = new Date();

    public session: Session;

    private cachedSession: Observable<Session>;
    public events: Event[] = new Array();
    private cachedEvents: Observable<Event[]>;

    public onNewData: EventEmitter<Session> = new EventEmitter();
    public onNewEvents: EventEmitter<Event[]> = new EventEmitter();
    public onLoggedOut: EventEmitter<any> = new EventEmitter();
    public onLoggedIn: EventEmitter<any> = new EventEmitter();

    public onSessionError: EventEmitter<any> = new EventEmitter();
    public onCommandError: EventEmitter<any> = new EventEmitter();

    public URL() : string {
        return this.schema + '//' + this.host + ':' + this.port + this.path;
    }

    public Ready() : boolean {
        return this.isLogged && this.session && this.session.modules && this.session.modules.length > 0;
    }

    constructor(private http:HttpClient) {
        this.cachedSession = new Observable((observer) => {
            observer.next(this.session);
            observer.complete();
        });

        this.cachedEvents = new Observable((observer) => {
            observer.next(this.events);
            observer.complete();
        });
    }

    public pollEvents() {
        console.log("api.pollEvents() started");
        return interval(this.interval)
            .pipe(
                startWith(0),
                switchMap(() => this.getEvents())
            );
    }

    public pollSession() {
        console.log("api.pollSession() started");
        return interval(this.interval)
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

            this.schema = creds.schema;
            this.host = creds.host;
            this.port = creds.port;
            this.path = creds.path;
            this.numEvents = creds.numEvents || this.numEvents;

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
            schema: this.schema,
            host:this.host,
            port: this.port,
            path: this.path,
            numEvents: this.numEvents
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
        .get<Event[]>( this.URL() + '/events', 
        {
            headers: this.headers,
            params: {'n': String(this.numEvents)}
        })
        .map(response => {
            this.events = response;
            this.onNewEvents.emit(response);
            return response;
        })
        .catch(error => {
            return this.cachedEvents;
        });
    }

    public getSession() : Observable<Session> {
        this.start = new Date();

        return this.http
        .get<Session>( this.URL() + '/session', {headers: this.headers})
        .map(response => {
            this.end = new Date();

            let wasLogged = this.isLogged;

            this.session = response;

            if(  compareVersions(this.session.version, environment.requires) == -1 ) {
                if( environment.production ) {
                    this.logout();
                    this.onLoggedOut.emit({
                        status: 666,
                        error: "This client requires at least API v" + environment.requires + 
                               " but " + this.URL() + " is at v" + this.session.version
                    });

                    return response;
                } else {
                    /*
                    console.error(
                        "version mismatch, UI requires API v" + environment.requires + 
                        " but " + this.URL() + " is at v" + this.session.version
                    );
                    */
                }
            }

            this.saveCreds();
            if(wasLogged == false) {
                console.log("loggedin.emit");
                this.onLoggedIn.emit();
            }

            this.onNewData.emit(response);
            return response;
        })
        .catch(error => {
            this.end = new Date();
            this.error = error;

            if( error.status == 401 ) {
                this.logout();
                console.log("loggedout.emit");
                this.onLoggedOut.emit(error);
            } else {
                console.log("error.emit");
                this.onSessionError.emit(error);
            }
            return this.cachedSession;
        });
    }

    public module(name : string) {
        for( let i = 0; i < this.session.modules.length; i++ ){
            let mod = this.session.modules[i];
            if( mod.name == name ) {
                return mod;
            }
        }
        return null;
    }

    public ping() {
        return this.end.getTime() - this.start.getTime();
    }

    public clearEvents() {
        console.log("clearing events");
        this.http
        .delete( this.URL() + '/events', {headers: this.headers})
        .subscribe(response => {
            this.events = [];
            this.onNewEvents.emit([]);
        }, error => {
            // return throwError(error);
        });
    }

    public isModuleEnabled(name: string) : boolean {
        if(this.session && this.session.modules) {
            let mod = this.module(name);
            return mod && mod.running ?  true : false;
        }
        return false;
    }

    public readFile(name : string) {
        console.log("readFile " + name);
        return this.http.get<Response>(
            this.URL() + '/file', 
            {
                headers: this.headers,
                responseType: 'text' as 'json',
                params: {'name': name}
            });
    }

    public writeFile(name : string, data : string) {
        console.log("writeFile " + name + " " + data.length + "b");
        return this.http.post<Response>(
            this.URL() + '/file', 
            new Blob([data]),
            {
                headers: this.headers,
                params: {'name': name}
            });
    }

    public cmdResponse(cmd : string) {
        console.log("cmd: " + cmd);
        return this.http.post<Response>(
            this.URL() + '/session', 
            {cmd: cmd},
            {headers: this.headers});
    }

    public cmd(cmd: string) {
        console.log("cmd: " + cmd);
        return this.http.post<Response>(
            this.URL() + '/session', 
            {cmd: cmd},
            {headers: this.headers}).subscribe(
                (val) => {},
                error => {
                    this.onCommandError.emit(error);
                },
                () => {});
    }
}
