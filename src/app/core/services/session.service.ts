import {Injectable} from '@angular/core';
import {Session} from '../models/session';
import {HttpClient} from '@angular/common/http';
import {SessionStoreService} from './session-store.service';
import MockedSession from '../../../mockedSession.json';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private http: HttpClient,
    private store: SessionStoreService
  ) {}

  loadSession() {
    return new Promise((resolve, reject) => {
      this.http
        .get<Session>('http://192.168.1.19:8081/api/session')
        .subscribe(
          session => {
            this.store.init(session);
            resolve(true);
          },
          error => {
            console.log('Bettercap seem unreachable :( Try to retrieve a mocked session...');
            // reject();
            if (this._getMockedSession()) {
              resolve();
            } else {
              reject();
            }
          }
        );
    });
  }
  _getMockedSession() {
    this.store.init(MockedSession);
    console.log('Hydra started with mocked session.');
    return true;
  }
}
