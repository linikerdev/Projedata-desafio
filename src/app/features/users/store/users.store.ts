import { Injectable, signal } from '@angular/core';
import { User } from '../../../core/models/user.model';

@Injectable()
export class UsersStore {
  readonly users = signal<User[]>([]);
  readonly totalCount = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(6);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly nameQuery = signal('');
  /** Reserved for future inline edit / detail flows */
  readonly selectedUser = signal<User | null>(null);

  setUsers(next: User[]): void {
    this.users.set(next);
  }

  setTotalCount(n: number): void {
    this.totalCount.set(n);
  }

  setPageIndex(i: number): void {
    this.pageIndex.set(i);
  }

  setPageSize(n: number): void {
    this.pageSize.set(n);
  }

  setLoading(on: boolean): void {
    this.loading.set(on);
  }

  setError(message: string | null): void {
    this.error.set(message);
  }

  setNameQuery(q: string): void {
    this.nameQuery.set(q);
  }

  setSelectedUser(user: User | null): void {
    this.selectedUser.set(user);
  }
}
