/** Categoria de telefone nos registros (valores em português, como no backend/mock). */
export type PhoneKind = 'celular' | 'fixo' | 'comercial';

/** Entidade persistida — propriedades alinhadas ao JSON/dados em português. */
export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipoTelefone: PhoneKind;
}
