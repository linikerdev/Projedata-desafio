# desafio-users

CRUD simples de usuários com lista em cards, busca com debounce e modal para criar/editar. Foi o que pediram no desafio.

## Stack

- Angular 19 (standalone)
- Angular Material
- RxJS na busca (`debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`, `finalize`)
- Signals no store (`UsersStore`)
- Reactive Forms no modal
- Vitest + `@analogjs/vitest-angular` pros testes

## Como rodar

```bash
npm install
npm start
```

Abre em `http://localhost:4200/`.

Build de produção:

```bash
npm run build
```

## Testes

```bash
npm test
```

Com cobertura (relatório em `coverage/`):

```bash
npm run test:coverage
```

## Estrutura (resumo)

```
src/app/
  core/models/          tipos compartilhados (Usuario, etc.)
  features/users/
    components/         lista + dialog do formulário
    data/               mock fixo
    pages/              shell da rota
    services/           mock com delay
    store/              facade em signals
  shared/validators/    CPF e telefone BR
```

## Decisões rápidas

- **Store no provider da rota**: o `UsersStore` só existe na rota de usuários, não polui o root.
- **Busca**: `toObservable` no signal `filtro` + debounce; o `switchMap` cancela request antiga se o usuário digitar de novo.
- **Mock**: array em memória no service, com `timer` pra simular latência. Tem flag `simularFalhaNaBusca` se quiser ver erro (desligado por padrão).
- **Vitest**: usei o builder da Analog; o `setupTestBed` deles deu conflito com a versão do Angular aqui, então a inicialização do `TestBed` ficou explícita no `test-setup.ts`.

## Observação

Os CPFs do mock passam no validador (dígitos verificadores). Se colar CPF inventado no form, o campo vai reclamar.
