import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HubspotHttpservice {

  constructor(
    private http: HttpClient
  ) {}

  getInitialData(): Observable<any> {
    return this.http.get<any>('https://cat-fact.herokuapp.com/facts').pipe(
      tap(x => console.log('x', x)),
      catchError(err => {
        return throwError(() => new Error(err.message))
      })
    )
  }

  sendFormattedData(data: any): Observable<any> {

    return of(true);
    // return this.http.post(url, data).pipe(
    //   tap(x => console.log('x', x))
    // )
  }
}
