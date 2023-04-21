import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DonersDataResponse } from '../shared/types/doners-data-response';

const url: string =
  'https://shwerma-radar-default-rtdb.europe-west1.firebasedatabase.app/doners2/';
@Injectable({
  providedIn: 'root',
})
export class GetDonersDataService {
  constructor(private http: HttpClient) {}

  getDeners(): Observable<DonersDataResponse[]> {
    return this.http.get(`${url}.json`).pipe(
      map((res: any) => {
        const arr: DonersDataResponse[] = [];
        Object.keys(res).forEach((key) => {
          arr.push({ ...res[key] });
        });
        return arr;
      })
    );
  }
}
