import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlockService {

    constructor(){}

    private blockBody = new Subject<boolean>();

    getBlock(): Observable<boolean> {
        return this.blockBody.asObservable();
    }

    cleanBlock(){
        this.blockBody.next(false);
    }

    setBlock() {
        this.blockBody.next(true);
    }

}
