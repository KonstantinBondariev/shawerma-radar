import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doner } from '../shared/types/doner';

const url: string =
  'https://shwerma-radar-default-rtdb.europe-west1.firebasedatabase.app/doners2/';
const url2: string =
  'https://shwerma-radar-default-rtdb.europe-west1.firebasedatabase.app/doners/';
@Injectable({
  providedIn: 'root',
})
export class NewDonerService {
  newDoner?: Doner;

  constructor(private http: HttpClient) {}

  postNewDoner(newDoner: Doner): Observable<any> {
    return this.http.post<any>(`${url}.json`, newDoner);
  }
}
