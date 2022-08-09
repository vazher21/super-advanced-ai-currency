import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) {}

  getRate(source: string, target: string): Observable<number> {
    return this.http
      .get<number>(
        `https://v6.exchangerate-api.com/v6/84d546509cd6dad6cef7fd80/pair/${source}/${target}`
      )
      .pipe(map((response) => (response as unknown as any).conversion_rate));
  }
}
