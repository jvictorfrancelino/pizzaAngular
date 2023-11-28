import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PizzaService {
  constructor(private httpClient: HttpClient) {}

  getPizzas(): Observable<any[]> {
    return this.httpClient
    .get('http://localhost:8080/api/pizzas/')
    .pipe(
      map((response: any) => response.pizzasList),
      catchError((error) => {
        return of([]); //
      })
    );
  }

  addPizza(data: any): Observable<any> {
    return this.httpClient.post('http://localhost:8080/api/pizzas/', data);
  }

  updatePizza(id: number, data: any): Observable<any> {
    return this.httpClient.put(`http://localhost:8080/api/pizzas/`, data);
  }

  deletePizza(id: number): Observable<any> {
    return this.httpClient.delete(`http://localhost:8080/api/pizzas/${id}`);
  }
}
