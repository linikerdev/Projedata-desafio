import { TestBed } from '@angular/core/testing';
import { User } from '../../../core/models/user.model';
import { UsersStore } from './users.store';

describe('UsersStore', () => {
  let store: UsersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersStore],
    });
    store = TestBed.inject(UsersStore);
  });

  it('mirrors users into the signal', () => {
    const rows: User[] = [
      {
        id: 'x',
        nome: 'A',
        email: 'a@a.com',
        cpf: '39053344705',
        telefone: '11999999999',
        tipoTelefone: 'celular',
      },
    ];
    store.setUsers(rows);
    expect(store.users()).toEqual(rows);
  });

  it('tracks loading and error flags', () => {
    store.setLoading(true);
    expect(store.loading()).toBe(true);
    store.setLoading(false);
    expect(store.loading()).toBe(false);
    store.setError('falhou');
    expect(store.error()).toBe('falhou');
    store.setError(null);
    expect(store.error()).toBeNull();
  });

  it('stores pagination metadata', () => {
    store.setTotalCount(40);
    expect(store.totalCount()).toBe(40);
    store.setPageIndex(2);
    expect(store.pageIndex()).toBe(2);
    store.setPageSize(12);
    expect(store.pageSize()).toBe(12);
  });

  it('keeps search text and optional selection', () => {
    store.setNameQuery('ana');
    expect(store.nameQuery()).toBe('ana');
    const u: User = {
      id: '1',
      nome: 'B',
      email: 'b@b.com',
      cpf: '39053344705',
      telefone: '11888888888',
      tipoTelefone: 'fixo',
    };
    store.setSelectedUser(u);
    expect(store.selectedUser()).toEqual(u);
    store.setSelectedUser(null);
    expect(store.selectedUser()).toBeNull();
  });
});
