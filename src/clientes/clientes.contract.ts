export interface ClientesContract {
  findOne(id: number): Promise<{ id: number; nome: string; cpf: string }>;
}

export const CLIENTES_CONTRACT = Symbol('CLIENTES_CONTRACT');