import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../store/users.store';
import { UserListComponent } from './user-list.component';

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

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('formats CPF and phone for display', () => {
    const c = fixture.componentInstance;
    expect(c.formatCpfDisplay('39053344705')).toMatch(/390/);
    expect(c.formatPhoneDisplay('11987654321')).toContain('11');
  });

  it('derives initials and phone labels', () => {
    const c = fixture.componentInstance;
    expect(c.initialsFromName('Ana Paula Costa')).toBe('AC');
    expect(c.initialsFromName('Z')).toBe('Z');
    expect(c.phoneKindLabel('fixo')).toBeTruthy();
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
});
