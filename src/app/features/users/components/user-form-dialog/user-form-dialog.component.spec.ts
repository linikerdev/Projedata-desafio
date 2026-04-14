import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { UsersService } from '../../services/users.service';
import { UserFormDialogComponent } from './user-form-dialog.component';

const noopUsersApi = { save: () => of(undefined) };

describe('UserFormDialogComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('starts invalid for a blank create form', () => {
    TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { user: null } },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
        { provide: UsersService, useValue: noopUsersApi },
      ],
    });
    const fixture = TestBed.createComponent(UserFormDialogComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    expect(c.form.invalid).toBe(true);
    expect(c.isEditMode).toBe(false);
  });

  it('hydrates controls when editing', () => {
    TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {
              id: '1',
              nome: 'Marina Alves',
              email: 'marina@email.com',
              cpf: '39053344705',
              telefone: '11987654321',
              tipoTelefone: 'celular' as const,
            },
          },
        },
        { provide: MatDialogRef, useValue: { close: () => undefined } },
        { provide: UsersService, useValue: noopUsersApi },
      ],
    });
    const fixture = TestBed.createComponent(UserFormDialogComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    expect(c.isEditMode).toBe(true);
    expect(c.form.controls.nome.value).toBe('Marina Alves');
  });

  it('dismiss closes with false', () => {
    const close = vi.fn();
    TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { user: null } },
        { provide: MatDialogRef, useValue: { close } },
        { provide: UsersService, useValue: noopUsersApi },
      ],
    });
    const fixture = TestBed.createComponent(UserFormDialogComponent);
    fixture.detectChanges();
    fixture.componentInstance.dismiss();
    expect(close).toHaveBeenCalledWith(false);
  });

  it('saveUser closes with true after successful save', () => {
    const close = vi.fn();
    const save = vi.fn(() => of(undefined));
    TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { user: null } },
        { provide: MatDialogRef, useValue: { close } },
        { provide: UsersService, useValue: { save } },
      ],
    });
    const fixture = TestBed.createComponent(UserFormDialogComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    c.form.patchValue({
      nome: 'Novo Usuario',
      email: 'n@u.com',
      cpf: '39053344705',
      telefone: '11987654321',
      tipoTelefone: 'celular',
    });
    c.saveUser();
    expect(save).toHaveBeenCalled();
    expect(close).toHaveBeenCalledWith(true);
  });

  it('saveUser does not call API when form is invalid', () => {
    const save = vi.fn(() => of(undefined));
    TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { user: null } },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: UsersService, useValue: { save } },
      ],
    });
    const fixture = TestBed.createComponent(UserFormDialogComponent);
    fixture.detectChanges();
    fixture.componentInstance.saveUser();
    expect(save).not.toHaveBeenCalled();
  });
});
