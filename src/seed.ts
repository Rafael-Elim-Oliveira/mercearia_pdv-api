import { DataSource } from 'typeorm';
import { Cliente } from './clientes/entities/cliente.entity';
import { Produto } from './produtos/entities/produto.entity';
import { Venda } from './vendas/entities/venda.entity';
import { ItemVenda } from './vendas/entities/item-venda.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'pdv',
    password: process.env.DB_PASSWORD || 'pdv',
    database: process.env.DB_NAME || 'pdv_db',
    entities: [Cliente, Produto, Venda, ItemVenda],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Conectado ao banco. Iniciando seed...');

  const clienteRepo = dataSource.getRepository(Cliente);
  const produtoRepo = dataSource.getRepository(Produto);

  // Limpa dados antigos (ordem importa por causa das FKs)
  await dataSource.getRepository(ItemVenda).clear();
  await dataSource.getRepository(Venda).clear();
  await produtoRepo.clear();
  await clienteRepo.clear();

  // Clientes
  const clientes = await clienteRepo.save([
    { nome: 'Ana Souza', cpf: '11122233344', telefone: '11999990001' },
    { nome: 'Bruno Lima', cpf: '22233344455', telefone: '11999990002' },
    { nome: 'Carla Mendes', cpf: '33344455566', telefone: null },
  ]);
  console.log(`✓ ${clientes.length} clientes criados`);

  // Produtos
  const produtos = await produtoRepo.save([
    { nome: 'Arroz 5kg', preco: 24.90, estoque: 50 },
    { nome: 'Feijão 1kg', preco: 8.50, estoque: 80 },
    { nome: 'Óleo de Soja 900ml', preco: 6.90, estoque: 40 },
    { nome: 'Café 500g', preco: 18.00, estoque: 30 },
    { nome: 'Leite 1L', preco: 4.50, estoque: 60 },
    { nome: 'Açúcar 1kg', preco: 5.20, estoque: 45 },
  ]);
  console.log(`✓ ${produtos.length} produtos criados`);

  console.log('Seed finalizado com sucesso.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});