import { DataSource } from "typeorm";
import { Cliente } from "./clientes/entities/cliente.entity";
import { Produto } from "./produtos/entities/produto.entity";
import { Venda } from "./vendas/entities/venda.entity";
import { ItemVenda } from "./vendas/entities/item-venda.entity";
import * as dotenv from 'dotenv';
dotenv.config()

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Cliente, Produto, Venda, ItemVenda],
    synchronize: true,
});

async function runSeed() {
    try {
        console.log('Conectando ao banco de dados...');
        await AppDataSource.initialize();

        const clienteRepo = AppDataSource.getRepository(Cliente);
        const produtoRepo = AppDataSource.getRepository(Produto);
        const vendaRepo = AppDataSource.getRepository(Venda);
        const itemVendaRepo = AppDataSource.getRepository(ItemVenda);

        console.log('Limpando registros antigos...');
        await AppDataSource.query('TRUNCATE TABLE itens_venda, vendas, produtos, clientes RESTART IDENTITY CASCADE;');

        console.log('Inserindo Clientes...');
        const clientes = await clienteRepo.save([
            { nome: 'Antonio Oliveira', cpf: '123.456.789-10', telefone: '6699887766' },
            { nome: 'Beatriz Almeida', cpf: '125.457.780-11'},
        ]);

        console.log('Inserindo Produtos...');
        const produtos = await produtoRepo.save([
            { nome: 'Arroz Rei 5kg', preco: 25.90, estoque: 50 },
            { nome: 'Açúcar Barralcool 2kg', preco: 12.90, estoque: 100 },
            { nome: 'Óleo Soja Soya 900ml', preco: 7.59, estoque: 0 }
        ]);

        console.log('Inserindo Vendas...');
        const vendas = await vendaRepo.save([
            { data: new Date('2026-10-08'), valorTotal: 59.39, status: 'CONCLUIDA', cliente: clientes[0]},
            { data: new Date('2026-11-17'), valorTotal: 129.90, status: 'CONCLUIDA', cliente: clientes[1] },
        ]);

        console.log('Inserindo Itens-venda...');
        await itemVendaRepo.save([
            { quantidade: 2, precoUnitario: 25.90, subtotal: 51.80, produto: produtos[0], venda: vendas[0]},
            { quantidade: 1, precoUnitario: 7.59, subtotal: 7.59, produto: produtos[2], venda: vendas[0]},
            { quantidade: 10, precoUnitario: 12.90, subtotal: 129.90, produto: produtos[1], venda: vendas[1]},
        ]);

        console.log('2 clientes cadastrados');
        console.log('3 produtos cadastrados');
        console.log('2 vendas registradas');
        console.log('3 itens-venda registrados');
    } catch (error) {
        console.error('Erro ao rodar o seed:', error);
    } finally {
        if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        }
    }
}

runSeed();