import { PhoneKind, User } from '../../../core/models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    nome: 'Marina Alves',
    email: 'marina.alves@email.com',
    cpf: '39053344705',
    telefone: '11987654321',
    tipoTelefone: 'celular',
  },
  {
    id: '2',
    nome: 'Ricardo Mota',
    email: 'ricardo.mota@empresa.net',
    cpf: '10123456703',
    telefone: '2133344556',
    tipoTelefone: 'fixo',
  },
  {
    id: '3',
    nome: 'Fernanda Costa',
    email: 'fe.costa@gmail.com',
    cpf: '85351346893',
    telefone: '47999887766',
    tipoTelefone: 'celular',
  },
  {
    id: '4',
    nome: 'Paulo Henrique',
    email: 'ph.oliveira@outlook.com',
    cpf: '24971563792',
    telefone: '61988776655',
    tipoTelefone: 'celular',
  },
  {
    id: '5',
    nome: 'Juliana Prado',
    email: 'ju.prado@corp.com.br',
    cpf: '10246913495',
    telefone: '1133221100',
    tipoTelefone: 'comercial',
  },
  {
    id: '6',
    nome: 'Lucas Ferreira',
    email: 'lucasf.dev@gmail.com',
    cpf: '10370370147',
    telefone: '21991234004',
    tipoTelefone: 'celular',
  },
  {
    id: '7',
    nome: 'Camila Rocha',
    email: 'camila.r@email.com',
    cpf: '10493826840',
    telefone: '85999001122',
    tipoTelefone: 'celular',
  },
  {
    id: '8',
    nome: 'André Santos',
    email: 'andre.santos@mail.com',
    cpf: '10617283583',
    telefone: '6230114455',
    tipoTelefone: 'fixo',
  },
];

export const PHONE_KIND_OPTIONS: { value: PhoneKind; label: string }[] = [
  { value: 'celular', label: 'Celular' },
  { value: 'fixo', label: 'Fixo' },
  { value: 'comercial', label: 'Comercial' },
];
