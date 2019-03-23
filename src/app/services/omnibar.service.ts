import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class OmniBarService {
    public query : string = '';

    constructor() { }
}

