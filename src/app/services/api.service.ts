import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import compareVersions from 'compare-versions';

import { Observable } from 'rxjs/Observable';
import { startWith, switchMap } from "rxjs/operators";
import { from } from 'rxjs';
import { interval } from "rxjs/internal/observable/interval";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';
import { Session } from '../models/session';
import { Event } from '../models/event';
import { Command, Response } from '../models/command';

declare var $: any;

export class Settings {
    public schema: string = document.location.protocol || 'http:';
    public host: string = document.location.hostname || "127.0.0.1";
    public port: string = (document.location.protocol || 'http:') == 'http:' ? '8081' : '8083';
    public path: string = '/api';
    public interval: number = 1000;
    public events: number = 25;
    public muted: string[] = [];
    public omnibar: boolean = true;
    public pinned: any = {
        modules: {},
        caplets: {}
    };

    public URL(): string {
        return this.schema + '//' + this.host + ':' + this.port + this.path;
    }

    public Warning(): boolean {
        if (this.host == 'localhost' || this.host == '127.0.0.1')
            return false;

        return this.schema != 'https:';
    }

    public isPinned(name: string): boolean {
        return (name in this.pinned.modules) || (name in this.pinned.caplets);
    }

    public pinToggle(name: string, what: string) {
        if (what == 'caplet') {
            if (this.isPinned(name))
                delete this.pinned.caplets[name];
            else
                this.pinned.caplets[name] = true;
        } else {
            if (this.isPinned(name))
                delete this.pinned.modules[name];
            else
                this.pinned.modules[name] = true;
        }
    }

    public from(obj: any) {
        this.schema = obj.schema || this.schema;
        this.host = obj.host || this.host;
        this.port = obj.port || this.port;
        this.path = obj.path || this.path;
        this.interval = obj.interval || this.interval;
        this.events = obj.events || this.events;
        this.muted = obj.muted || this.muted;
        this.omnibar = obj.omnibar || this.omnibar;
        this.pinned = obj.pinned || this.pinned;
    }

    public save() {
        localStorage.setItem('settings', JSON.stringify({
            schema: this.schema,
            host: this.host,
            port: this.port,
            path: this.path,
            interval: this.interval,
            events: this.events,
            muted: this.muted,
            omnibar: this.omnibar,
            pinned: this.pinned
        }));
    }
}

export class Credentials {
    public valid: boolean = false;
    public user: string = "";
    public pass: string = "";
    public headers: HttpHeaders = null;

    public set(user: string, pass: string) {
        this.user = user;
        this.pass = pass;
        this.headers = new HttpHeaders().set("Authorization", "Basic " + btoa(this.user + ":" + this.pass));
    }

    public save() {
        localStorage.setItem('auth', JSON.stringify({
            username: this.user,
            password: this.pass
        }));
    }

    public clear() {
        this.user = "";
        this.pass = "";
        this.headers = null;
    }
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    // what API to interact with and how to interact with it
    public settings: Settings = new Settings();
    // updated session object
    public session: Session = null;
    // updated events objects
    public events: Event[] = new Array();
    // current /api/session execution time in milliseconds
    public ping: number = 0;
    // true if updates have been paused
    public paused: boolean = false;
    // filled if /api/session can't be retrieved
    public error: any = null;
    // if filled it will pass the parameter once to /api/session
    public sessionFrom: string = '';
    // if filled it will pass the parameter once to /api/events
    public eventsFrom: string = '';

    // triggerd when the session object has been updated
    public onNewData: EventEmitter<Session> = new EventEmitter();
    // triggered when the events have been updated
    public onNewEvents: EventEmitter<Event[]> = new EventEmitter();
    // triggered when the user credentials are not valid
    public onLoggedOut: EventEmitter<any> = new EventEmitter();
    // triggered when the user credentials are valid and he's just been logged in
    public onLoggedIn: EventEmitter<any> = new EventEmitter();
    // triggered when there's an error (either bad auth or just the api is down) on /api/session
    public onSessionError: EventEmitter<any> = new EventEmitter();
    // triggered when a command returns an error
    public onCommandError: EventEmitter<any> = new EventEmitter();

    private creds: Credentials = new Credentials();
    private cachedSession: Observable<Session>;
    private cachedEvents: Observable<Event[]>;

    constructor(private http: HttpClient) {
        // we use these observable objects to return a cached
        // version of the session or the events when an error
        // occurs
        this.cachedSession = new Observable((observer) => {
            observer.next(this.session);
            observer.complete();
        });

        this.cachedEvents = new Observable((observer) => {
            observer.next(this.events);
            observer.complete();
        });

        // credentials might be stored in the local storage already,
        // try to load and authenticate with them in order to restore
        // the user session
        this.loadStorage();
    }

    // return true if the user is logged in with valid credentials
    // and we got the first session object
    public Ready(): boolean {
        return this.creds.valid && this.session && this.session.modules && this.session.modules.length > 0;
    }

    // return a module given its name
    // TODO: just use a dictionary for session.modules!
    public module(name: string) {
        for (let i = 0; i < this.session.modules.length; i++) {
            let mod = this.session.modules[i];
            if (mod.name == name) {
                return mod;
            }
        }
        return null;
    }

    public env(name: string) {
        for (let key in this.session.env.data) {
            if (name == key)
                return this.session.env.data[key];
        }
        return "";
    }

    // start polling /api/events every second
    public pollEvents() {
        console.log("api.pollEvents() started");
        return interval(this.settings.interval)
            .pipe(
                startWith(0),
                switchMap(() => this.getEvents())
            );
    }

    // start polling /api/session every second
    public pollSession() {
        console.log("api.pollSession() started");
        return interval(this.settings.interval)
            .pipe(
                startWith(0),
                switchMap(() => this.getSession())
            );
    }

    // set the user credentials and try to login
    public login(username: string, password: string) {
        console.log("api.login()");
        this.creds.set(username, password);
        return this.getSession();
    }

    // log out the user
    public logout() {
        if (this.creds.valid == false)
            return;

        console.log("api.logout()");
        this.clearStorage();
        this.creds.valid = false;
    }

    // read settings and user credentials from the local storage if available
    private loadStorage() {
        let sets = localStorage.getItem('settings');
        if (sets) {
            this.settings.from(JSON.parse(sets));
        }

        let auth = localStorage.getItem('auth');
        if (auth) {
            let creds = JSON.parse(auth);
            console.log("found stored credentials");
            this.login(creds.username, creds.password).subscribe((session) => {
                this.session = session;
            });
        } else {
            this.session = null;
            this.creds.valid = false;
            this.onLoggedOut.emit(null);
        }
    }

    // remove settings and user credentials from the local storage
    private clearStorage() {
        console.log("api.clearStorage()");

        localStorage.removeItem('auth');

        this.creds.clear();
    }

    // save settings and user credentials to the local storage
    private saveStorage() {
        this.creds.save();
        this.settings.save();
    }

    // handler for /api/events response
    private eventsNew(response) {
        if (this.paused == false) {
            this.events = response;
            this.onNewEvents.emit(response);
        }
        return response;
    }

    // handler for /api/events error
    private eventsError(error) {
        // if /api/events fails, most likely /api/session is failing
        // as well, either due to wrong credentials or to the API not
        // being reachable - let the main session request fail and 
        // set the error state, this one will just fail silently
        // and return the cached events.
        return this.cachedEvents;
    }

    // GET /api/events and return an observable list of events
    public getEvents(): Observable<Event[]> {
        if (this.isPaused())
            return this.cachedEvents;

        let from = this.eventsFrom;
        if (from != '') {
            this.eventsFrom = '';
        }

        return this.http
            .get<Event[]>(this.settings.URL() + '/events',
                {
                    headers: this.creds.headers,
                    params: { 'from': from, 'n': String(this.settings.events) }
                })
            .map(response => this.eventsNew(response))
            .catch(error => this.eventsError(error));
    }

    // DELETE /api/events and clear events
    public clearEvents() {
        console.log("clearing events");
        this.http
            .delete(this.settings.URL() + '/events', { headers: this.creds.headers })
            .subscribe(response => this.eventsNew([]));
    }

    // set the credentials as valid after a succesfull session request,
    // if the user was logged out, it'll emit the onLoggedIn event
    private setLoggedIn(): boolean {
        let wasLogged = this.creds.valid;

        this.creds.valid = true;
        this.saveStorage();

        // if the user wasn't logged, broadcast the logged in event
        if (wasLogged == false) {
            console.log("loggedin.emit");
            this.onLoggedIn.emit();
        }

        return wasLogged;
    }

    // handler for /api/session error
    private sessionError(error) {
        this.ping = 0;

        // handle bad credentials and general errors separately
        if (error.status == 401) {
            this.logout();
            console.log("loggedout.emit");
            this.onLoggedOut.emit(error);
        } else {
            this.error = error;
            console.log("error.emit");
            this.onSessionError.emit(error);
        }

        // return an observable to the last cached object
        return this.cachedSession;
    }

    // handler for /api/session response
    private sessionNew(start, response) {
        let wasError = this.error != null;

        this.ping = new Date().getTime() - start.getTime();
        this.error = null;

        // if in prod, make sure we're talking to a compatible API version
        if (compareVersions(response.version, environment.requires) == -1) {
            if (environment.production) {
                this.logout();
                this.onLoggedOut.emit({
                    status: 666,
                    error: "This client requires at least API v" + environment.requires +
                        " but " + this.settings.URL() + " is at v" + response.version
                });
                return response;
            }
        }

        // save credentials and emit logged in event if needed
        let wasLogged = this.setLoggedIn();

        // update the session object instance
        this.session = response;

        let muted = this.module('events.stream').state.ignoring.sort();
        // if we just logged in and the user has muted events in his
        // preferences that are not in the API ignore list, we need to
        // restore them
        if (wasError == true || wasLogged == false) {
            let toRestore = this.settings.muted.filter(function (e) { return !muted.includes(e); })
            if (toRestore.length) {
                console.log("restoring muted events:", toRestore);
                for (let i = 0; i < toRestore.length; i++) {
                    this.cmd("events.ignore " + toRestore[i]);
                }
            }
        }
        // update muted events
        this.settings.muted = muted;
        // inform all subscribers that new data is available
        this.onNewData.emit(response);

        return response;
    }

    public isPaused() {
        // pause ui updates if:
        //
        // the user excplicitly pressed the paused button
        return this.paused ||
            // an action button is hovered (https://stackoverflow.com/questions/8981463/detect-if-hovering-over-element-with-jquery)
            $('.btn-action').filter(function () { return $(this).is(":hover"); }).length > 0 ||
            // a dropdown is open
            $('.menu-dropdown').is(':visible');
    }

    // GET /api/session and return an observable Session
    public getSession(): Observable<Session> {
        if (this.isPaused())
            return this.cachedSession;

        let from = this.sessionFrom;
        if (from != '') {
            this.sessionFrom = '';
        }

        let start = new Date();
        return this.http
            .get<Session>(this.settings.URL() + '/session', {
                headers: this.creds.headers,
                params: { 'from': from }
            })
            .map(response => this.sessionNew(start, response))
            .catch(error => this.sessionError(error));
    }

    // GET /api/file given its name
    public readFile(name: string) {
        console.log("readFile " + name);
        return this.http.get<Response>(
            this.settings.URL() + '/file',
            {
                headers: this.creds.headers,
                responseType: 'text' as 'json',
                params: { 'name': name }
            });
    }

    // POST /api/file given its name and new contents
    public writeFile(name: string, data: string) {
        console.log("writeFile " + name + " " + data.length + "b");

        this.paused = false;
        return this.http.post<Response>(
            this.settings.URL() + '/file',
            new Blob([data]),
            {
                headers: this.creds.headers,
                params: { 'name': name }
            });
    }

    // POST /api/session to execute a command, can be asynchronous and
    // just broadcast errors via the event emitter, or synchronous and 
    // return a subscribable response
    public cmd(cmd: string, sync: boolean = false) {
        this.paused = false;

        if (sync) {
            console.log("cmd: " + cmd);
            return this.http.post<Response>(
                this.settings.URL() + '/session',
                { cmd: cmd },
                { headers: this.creds.headers });
        }

        return this.cmd(cmd, true)
            .subscribe(
                (val) => { },
                error => { this.onCommandError.emit(error); },
                () => { });
    }
}
