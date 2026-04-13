import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { TodosActions } from '../../store/todos.actions';
import {
  selectAllTodos,
  selectPendingTodos,
  selectTodosError,
  selectTodosLoading,
} from '../../store/todos.selectors';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.scss',
})
export class TodosPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly todos$ = this.store.select(selectAllTodos);
  readonly pending$ = this.store.select(selectPendingTodos);
  readonly loading$ = this.store.select(selectTodosLoading);
  readonly error$ = this.store.select(selectTodosError);

  ngOnInit(): void {
    this.store.dispatch(TodosActions.loadTodos());
  }

  toggleTodo(id: number): void {
    this.store.dispatch(TodosActions.toggleTodoComplete({ id }));
  }
}
