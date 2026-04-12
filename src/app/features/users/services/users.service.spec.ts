import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MOCK_USERS } from '../data/users.mock';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersService);
  });

  it('returns every row when the name filter is empty', async () => {
    const { items, total } = await firstValueFrom(
      service.query('', 0, MOCK_USERS.length + 5),
    );
    expect(total).toBe(MOCK_USERS.length);
    expect(items.length).toBe(MOCK_USERS.length);
  });

  it('pages client-side slices', async () => {
    const pageSize = 2;
    const { total } = await firstValueFrom(service.query('', 0, pageSize));
    expect(total).toBe(MOCK_USERS.length);
    const first = await firstValueFrom(service.query('', 0, pageSize));
    const second = await firstValueFrom(service.query('', 1, pageSize));
    expect(first.items.length).toBe(pageSize);
    expect(second.items.length).toBe(pageSize);
    expect(first.items[0].id).not.toBe(second.items[0].id);
  });

  it('filters by name case-insensitively', async () => {
    const { items, total } = await firstValueFrom(service.query('marina'));
    expect(total).toBe(1);
    expect(items.length).toBe(1);
    expect(items[0].nome).toContain('Marina');
  });

  it('updates an existing row', async () => {
    const u = await firstValueFrom(
      service.save({
        id: '1',
        nome: 'Marina Alves Silva',
        email: 'marina.alves@email.com',
        cpf: '39053344705',
        telefone: '11987654321',
        tipoTelefone: 'celular',
      }),
    );
    expect(u.nome).toBe('Marina Alves Silva');
    const { items } = await firstValueFrom(
      service.query('', 0, MOCK_USERS.length + 5),
    );
    const found = items.find((x) => x.id === '1');
    expect(found?.nome).toBe('Marina Alves Silva');
  });

  it('appends a brand-new user', async () => {
    const u = await firstValueFrom(
      service.save({
        nome: 'Teste Novo',
        email: 'teste.novo@mail.com',
        cpf: '10123456703',
        telefone: '11999998888',
        tipoTelefone: 'celular',
      }),
    );
    expect(u.id).toBeDefined();
    const { items, total } = await firstValueFrom(service.query('Teste Novo'));
    expect(total).toBe(1);
    expect(items.length).toBe(1);
  });

  it('bubbles errors when failSearchRequests is enabled', async () => {
    service.failSearchRequests = true;
    await expect(firstValueFrom(service.query(''))).rejects.toThrow();
    service.failSearchRequests = false;
  });
});
