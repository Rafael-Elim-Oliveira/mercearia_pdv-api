export interface ProdutosContract {
  findOne(id: number): Promise<{ id: number; nome: string; preco: number; estoque: number }>;
  baixarEstoque(id: number, quantidade: number): Promise<void>;
  devolverEstoque(id: number, quantidade: number): Promise<void>;
}

export const PRODUTOS_CONTRACT = Symbol('PRODUTOS_CONTRACT');