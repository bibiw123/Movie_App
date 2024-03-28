import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private isLoading$ = new BehaviorSubject(false);
  public isLoading = this.isLoading$.asObservable()

  constructor() { }

  setLoader(isloading : boolean){
    this.isLoading$.next(isloading)
  }
}
