import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PhoneKind } from '../../../../core/models/user.model';
import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../store/users.store';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from './user-list.component';

const VIEW_KEY = 'desafio.userList.viewMode';

const sampleUser = {
  id: '1',
  nome: 'Fulano Silva',
  email: 'f@f.com',
  cpf: '39053344705',
  telefone: '11999999999',
  tipoTelefone: 'celular' as const,
};

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let store: UsersStore;
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoopAnimationsModule],
      providers: [
        UsersStore,
        {
          provide: UsersService,
          useValue: {
            query: () => of({ items: [sampleUser], total: 1 }),
            save: () => of({}),
          },
        },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(false) }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    store = TestBed.inject(UsersStore);
    store.setNameQuery('');
    store.setPageIndex(0);
    store.setPageSize(6);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('formats CPF and phone for display', () => {
    const c = fixture.componentInstance;
    expect(c.formatCpfDisplay('39053344705')).toMatch(/390/);
    expect(c.formatPhoneDisplay('11987654321')).toContain('11');
    expect(c.formatCpfDisplay('123')).toBe('123');
    expect(c.formatPhoneDisplay('1133334444')).toContain('11');
  });

  it('derives initials and phone labels', () => {
    const c = fixture.componentInstance;
    expect(c.initialsFromName('Ana Paula Costa')).toBe('AC');
    expect(c.initialsFromName('Z')).toBe('Z');
    expect(c.initialsFromName('  ')).toBe('?');
    expect(c.phoneKindLabel('fixo')).toBeTruthy();
    expect(c.phoneKindLabel('inventado' as PhoneKind)).toBe('inventado');
  });

  it('forwards pagination events into the store', () => {
    const c = fixture.componentInstance;
    const ev = new PageEvent();
    ev.pageIndex = 2;
    ev.pageSize = 12;
    ev.length = 100;
    c.onPageChange(ev);
    expect(store.pageIndex()).toBe(2);
    expect(store.pageSize()).toBe(12);
  });

  it('setViewMode updates signal and localStorage', () => {
    const c = fixture.componentInstance;
    c.setViewMode('list');
    expect(c.viewMode()).toBe('list');
    expect(localStorage.getItem(VIEW_KEY)).toBe('list');
    c.setViewMode('cards');
    expect(c.viewMode()).toBe('cards');
    expect(localStorage.getItem(VIEW_KEY)).toBe('cards');
  });

  it('setViewMode does nothing when mode is unchanged', () => {
    const c = fixture.componentInstance;
    const spy = vi.spyOn(Storage.prototype, 'setItem');
    c.setViewMode('list');
    const n = spy.mock.calls.length;
    c.setViewMode('list');
    expect(spy.mock.calls.length).toBe(n);
    spy.mockRestore();
  });

  it('starts in list mode when localStorage says list', () => {
    localStorage.setItem(VIEW_KEY, 'list');
    fixture.destroy();
    const f = TestBed.createComponent(UserListComponent);
    const s = TestBed.inject(UsersStore);
    s.setNameQuery('');
    s.setPageIndex(0);
    s.setPageSize(6);
    expect(f.componentInstance.viewMode()).toBe('list');
    f.destroy();
  });

  it('onSearchInput resets page and sets query', () => {
    const c = fixture.componentInstance;
    store.setPageIndex(3);
    c.onSearchInput('maria');
    expect(store.pageIndex()).toBe(0);
    expect(store.nameQuery()).toBe('maria');
  });

  it('clearSearch clears store and input', () => {
    const c = fixture.componentInstance;
    const input = document.createElement('input');
    input.value = 'x';
    store.setNameQuery('x');
    store.setPageIndex(2);
    const focusSpy = vi.spyOn(input, 'focus');
    c.clearSearch(input);
    expect(store.nameQuery()).toBe('');
    expect(store.pageIndex()).toBe(0);
    expect(input.value).toBe('');
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

});
