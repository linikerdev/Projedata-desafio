import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  firstValueFrom,
  merge,
  of,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { PhoneKind, User } from '../../../../core/models/user.model';
import { PHONE_KIND_OPTIONS } from '../../data/users.mock';
import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../store/users.store';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';

export type UserListViewMode = 'cards' | 'list';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private static readonly VIEW_STORAGE_KEY = 'desafio.userList.viewMode';

  private readonly dialog = inject(MatDialog);
  private readonly usersApi = inject(UsersService);
  readonly store = inject(UsersStore);

  readonly viewMode = signal<UserListViewMode>(UserListComponent.readStoredViewMode());

  constructor() {
    const store = this.store;
    const api = this.usersApi;

    const rawQuery$ = toObservable(store.nameQuery);
    const debouncedNameQuery$ = merge(
      rawQuery$.pipe(take(1)),
      rawQuery$.pipe(skip(1), debounceTime(300), distinctUntilChanged()),
    );

    combineLatest([
      debouncedNameQuery$,
      toObservable(store.pageIndex),
      toObservable(store.pageSize),
    ])
      .pipe(
        tap(() => {
          store.setError(null);
          store.setLoading(true);
        }),
        switchMap(([nameQuery, pageIndex, pageSize]) =>
          api.query(nameQuery, pageIndex, pageSize).pipe(
            catchError(() => {
              store.setError('Não deu para carregar a lista.');
              return of<PagedUsersFallback>({ items: [], total: 0 });
            }),
            finalize(() => store.setLoading(false)),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(({ items, total }) => {
        store.setUsers(items);
        store.setTotalCount(total);
      });
  }

  onSearchInput(value: string): void {
    this.store.setPageIndex(0);
    this.store.setNameQuery(value);
  }

  clearSearch(input: HTMLInputElement): void {
    this.store.setPageIndex(0);
    this.store.setNameQuery('');
    input.value = '';
    input.focus();
  }

  onPageChange(e: PageEvent): void {
    this.store.setPageSize(e.pageSize);
    this.store.setPageIndex(e.pageIndex);
  }

  setViewMode(mode: UserListViewMode): void {
    if (this.viewMode() === mode) {
      return;
    }
    this.viewMode.set(mode);
    try {
      localStorage.setItem(UserListComponent.VIEW_STORAGE_KEY, mode);
    } catch {
      /* ignore quota / private mode */
    }
  }

  openCreateDialog(): void {
    this.openUserForm(null);
  }

  openEditDialog(user: User): void {
    this.openUserForm(user);
  }

  private openUserForm(user: User | null): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      data: { user },
      width: 'min(92vw, 480px)',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((didMutate: boolean | undefined) => {
      if (!didMutate) {
        return;
      }
      this.store.setLoading(true);
      firstValueFrom(
        this.usersApi
          .query(
            this.store.nameQuery(),
            this.store.pageIndex(),
            this.store.pageSize(),
          )
          .pipe(
            catchError(() => {
              this.store.setError('Não deu para atualizar a lista.');
              return of<PagedUsersFallback>({ items: [], total: 0 });
            }),
            finalize(() => this.store.setLoading(false)),
          ),
      ).then(({ items, total }) => {
        this.store.setUsers(items);
        this.store.setTotalCount(total);
      });
    });
  }

  initialsFromName(fullName: string): string {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return fullName.trim().slice(0, 2).toUpperCase() || '?';
  }

  phoneKindLabel(kind: PhoneKind): string {
    return PHONE_KIND_OPTIONS.find((o) => o.value === kind)?.label ?? kind;
  }

  formatCpfDisplay(cpf: string): string {
    const n = cpf.replace(/\D/g, '');
    if (n.length !== 11) {
      return cpf;
    }
    return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatPhoneDisplay(phone: string): string {
    const n = phone.replace(/\D/g, '');
    if (n.length === 11) {
      return n.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (n.length === 10) {
      return n.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }

  private static readStoredViewMode(): UserListViewMode {
    try {
      return localStorage.getItem(UserListComponent.VIEW_STORAGE_KEY) === 'list' ? 'list' : 'cards';
    } catch {
      return 'cards';
    }
  }
}

type PagedUsersFallback = { items: User[]; total: number };
