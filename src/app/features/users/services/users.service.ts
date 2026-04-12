import { Injectable } from '@angular/core';
import { Observable, mergeMap, of, throwError, timer } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { MOCK_USERS } from '../data/users.mock';

export interface PagedUsers {
  items: User[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private nextId = 9;
  private records: User[] = MOCK_USERS.map((u) => ({ ...u }));

  private readonly latencyMs = 420;

  /** Flip to exercise the list error banner while developing. */
  failSearchRequests = false;

  query(
    nameQuery: string,
    pageIndex = 0,
    pageSize = 6,
  ): Observable<PagedUsers> {
    const q = nameQuery.trim().toLowerCase();
    return timer(this.latencyMs).pipe(
      mergeMap(() => {
        if (this.failSearchRequests) {
          return throwError(() => new Error('simulated search failure'));
        }
        const filtered = !q
          ? [...this.records]
          : this.records.filter((u) => u.nome.toLowerCase().includes(q));
        const total = filtered.length;
        const offset = pageIndex * pageSize;
        const items = filtered.slice(offset, offset + pageSize);
        return of({ items, total });
      }),
    );
  }

  save(payload: Omit<User, 'id'> & { id?: string }): Observable<User> {
    return timer(this.latencyMs).pipe(
      mergeMap(() => {
        if (payload.id) {
          const idx = this.records.findIndex((x) => x.id === payload.id);
          if (idx >= 0) {
            const updated: User = {
              id: payload.id,
              nome: payload.nome,
              email: payload.email,
              cpf: payload.cpf.replace(/\D/g, ''),
              telefone: payload.telefone.replace(/\D/g, ''),
              tipoTelefone: payload.tipoTelefone,
            };
            this.records[idx] = updated;
            return of({ ...updated });
          }
        }
        const created: User = {
          id: String(this.nextId++),
          nome: payload.nome,
          email: payload.email,
          cpf: payload.cpf.replace(/\D/g, ''),
          telefone: payload.telefone.replace(/\D/g, ''),
          tipoTelefone: payload.tipoTelefone,
        };
        this.records = [...this.records, created];
        return of(created);
      }),
    );
  }
}
