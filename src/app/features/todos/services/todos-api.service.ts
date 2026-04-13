import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodosApiService {
  private readonly http = inject(HttpClient);

  /** GET sobre JSON estático em `public/` — simula API sem backend. */
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>('/todos-mock.json');
  }
}
