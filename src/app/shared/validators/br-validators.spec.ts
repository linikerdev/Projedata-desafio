import { FormControl } from '@angular/forms';
import { brazilianCpfValidator, brazilianPhoneValidator } from './br-validators';

describe('br-validators', () => {
  const cpf = brazilianCpfValidator();
  const phone = brazilianPhoneValidator();

  it('accepts well-formed CPF strings', () => {
    expect(cpf(new FormControl('390.533.447-05'))).toBeNull();
    expect(cpf(new FormControl('39053344705'))).toBeNull();
  });

  it('rejects bogus CPF values', () => {
    expect(cpf(new FormControl('11111111111'))).toEqual({ invalidCpf: true });
    expect(cpf(new FormControl('123'))).toEqual({ invalidCpf: true });
  });

  it('accepts typical Brazilian phone lengths', () => {
    expect(phone(new FormControl('11987654321'))).toBeNull();
    expect(phone(new FormControl('1133334444'))).toBeNull();
  });

  it('flags phones outside the expected shape', () => {
    expect(phone(new FormControl('123'))).toEqual({ invalidPhone: true });
    expect(phone(new FormControl('00999999999'))).toEqual({ invalidPhone: true });
  });
});
