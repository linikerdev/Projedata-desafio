import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserFormDialogComponent } from './user-form-dialog.component';

describe('UserFormDialogComponent', () => {
  it('starts invalid for a blank create form', () => {
    TestBed.configureTestingModule({
      imports: [UserFormDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { user: null } },
        {
          provide: MatDialogRef,
          useValue: { close: () => undefined },
        },
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
        {
          provide: MatDialogRef,
          useValue: { close: () => undefined },
        },
      ],
    });
    const fixture = TestBed.createComponent(UserFormDialogComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    expect(c.isEditMode).toBe(true);
    expect(c.form.controls.nome.value).toBe('Marina Alves');
  });
});
