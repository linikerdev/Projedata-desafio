import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function isRepeatingCpfDigits(cpf: string): boolean {
  return /^(\d)\1{10}$/.test(cpf);
}

function cpfCheckDigit(cpf: string, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += parseInt(cpf[i], 10) * (length + 1 - i);
  }
  const mod = (sum * 10) % 11;
  return mod === 10 || mod === 11 ? 0 : mod;
}

export function brazilianCpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value as string | null | undefined;
    if (raw == null || raw === '') {
      return null;
    }
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length !== 11 || isRepeatingCpfDigits(digits)) {
      return { invalidCpf: true };
    }
    const d1 = cpfCheckDigit(digits, 9);
    const d2 = cpfCheckDigit(digits, 10);
    if (d1 !== parseInt(digits[9], 10) || d2 !== parseInt(digits[10], 10)) {
      return { invalidCpf: true };
    }
    return null;
  };
}

/** Accepts 10–11 digits; DDD 11–99 (Brazil). */
export function brazilianPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value as string | null | undefined;
    if (raw == null || raw === '') {
      return null;
    }
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      return { invalidPhone: true };
    }
    const area = parseInt(digits.slice(0, 2), 10);
    if (area < 11 || area > 99) {
      return { invalidPhone: true };
    }
    return null;
  };
}
