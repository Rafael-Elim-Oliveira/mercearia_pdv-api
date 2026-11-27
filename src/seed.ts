import { DataSource } from 'typeorm';
import { Cliente } from './clientes/entities/cliente.entity';
import { Produto } from './produtos/entities/produto.entity';
import { Venda } from './vendas/entities/venda.entity';
import { ItemVenda } from './vendas/entities/item-venda.entity';

const config = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'pdv',
  password: process.env.DB_PASSWORD ?? 'pdv',
  database: process.env.DB_DATABASE ?? 'pdv_db',
};

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    ...config,
    entities: [Cliente, Produto, Venda, ItemVenda],
    synchronize: true,
  });

  console.log(
    `Conectando em ${config.host}:${config.port}/${config.database} como ${config.username}...`,
  );
  await dataSource.initialize();
  console.log('Conectado ao banco. Iniciando seed...');

  try {
    await dataSource.query(
      'TRUNCATE TABLE itens_venda, vendas, produtos, cliente RESTART IDENTITY',
    );

    const clientes = await dataSource.getRepository(Cliente).save([
      { nome: 'Ana Souza', cpf: '11122233344', telefone: '11999990001' },
      { nome: 'Bruno Lima', cpf: '22233344455', telefone: '11999990002' },
      { nome: 'Carla Mendes', cpf: '33344455566', telefone: null },
    ]);
    console.log(`✓ ${clientes.length} clientes criados`);

    const produtos = await dataSource.getRepository(Produto).save([
      { nome: 'Arroz 5kg', preco: 24.9, estoque: 50 },
      { nome: 'Feijão 1kg', preco: 8.5, estoque: 80 },
      { nome: 'Óleo de Soja 900ml', preco: 6.9, estoque: 40 },
      { nome: 'Café 500g', preco: 18.0, estoque: 30 },
      { nome: 'Leite 1L', preco: 4.5, estoque: 60 },
      { nome: 'Açúcar 1kg', preco: 5.2, estoque: 45 },
    ]);
    console.log(`✓ ${produtos.length} produtos criados`);

    console.log('Seed finalizado com sucesso.');
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});