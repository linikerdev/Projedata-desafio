import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { PhoneKind, User } from '../../../../core/models/user.model';
import { brazilianCpfValidator, brazilianPhoneValidator } from '../../../../shared/validators/br-validators';
import { PHONE_KIND_OPTIONS } from '../../data/users.mock';
import { UsersService } from '../../services/users.service';

export interface UserFormDialogData {
  user: User | null;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersApi = inject(UsersService);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent, boolean>);

  private editingId?: string;
  readonly isEditMode: boolean;

  readonly phoneKindOptions = PHONE_KIND_OPTIONS;

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, brazilianCpfValidator()]],
    telefone: ['', [Validators.required, brazilianPhoneValidator()]],
    tipoTelefone: ['celular' as PhoneKind, Validators.required],
  });

  saving = false;

  constructor(@Inject(MAT_DIALOG_DATA) data: UserFormDialogData) {
    this.isEditMode = !!data.user;
    if (data.user) {
      const row = data.user;
      this.editingId = row.id;
      this.form.patchValue({
        nome: row.nome,
        email: row.email,
        cpf: row.cpf,
        telefone: row.telefone,
        tipoTelefone: row.tipoTelefone,
      });
    }
  }

  dismiss(): void {
    this.dialogRef.close(false);
  }

  saveUser(): void {
    if (this.form.invalid || this.saving) {
      return;
    }
    const v = this.form.getRawValue();
    this.saving = true;
    this.usersApi
      .save({
        id: this.editingId,
        nome: v.nome.trim(),
        email: v.email.trim(),
        cpf: v.cpf.replace(/\D/g, ''),
        telefone: v.telefone.replace(/\D/g, ''),
        tipoTelefone: v.tipoTelefone,
      })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => this.dialogRef.close(true),
      });
  }
}
