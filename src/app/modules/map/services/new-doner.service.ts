import { Injectable } from '@angular/core';
import { Doner } from '../shared/types/doner';

@Injectable({
  providedIn: 'root',
})
export class NewDonerService {
  newDoner?: Doner;

  constructor() {}
}
