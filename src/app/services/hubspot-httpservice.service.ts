import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HubspotHttpservice {

  constructor(
    private http: HttpClient
  ) {}

  getInitialData(): Observable<any> {
    return this.http.get<any>('https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=45865962a05835acd785608bfa6d').pipe(
      map(res => res.partners),
      catchError(err => {
        return throwError(() => new Error(err.message))
      })
    )
  }

  sendFormattedData(data: any): Observable<any> {
    let url = 'https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=45865962a05835acd785608bfa6d'

    return this.http.post(url, data).pipe(
      tap(x => console.log('x', x))
    )
  }
}
