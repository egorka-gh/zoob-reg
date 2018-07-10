import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Client } from './client';
import { ClientState} from './client.state';
import { ValidateResult } from './validate.result';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  private rootUrl = 'http://localhost:8080/';
  private statesUrl = 'states/';  // URL to web api
  private pingUrl = 'ping/';
  private validateUrl = 'validate/';

  ping(): Observable<ValidateResult> {
    return this.http.get<ValidateResult>(this.rootUrl + this.pingUrl)
      .pipe(
        catchError(this.handleError('ping', new ValidateResult(0, '', -1, -1, 'Сервис не доступен')))
      );
  }

  getStates(): Observable<ClientState[]> {
    return this.http.get<ClientState[]>(this.rootUrl + this.statesUrl)
      .pipe(
        catchError(this.handleError('getStates', []))
      );
  }

  validateCard(card: string): Observable<ValidateResult> {
    const res: ValidateResult = new ValidateResult( 0, card, 0, 0, '');

    return this.http.post<ValidateResult>(this.rootUrl + this.validateUrl, res, httpOptions)
      .pipe(
        catchError(this.handleError('validateCard', new ValidateResult(0, '', -1, -1, 'Сервис не доступен')))
      );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
