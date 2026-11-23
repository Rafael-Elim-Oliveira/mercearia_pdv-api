import { Module } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemVenda } from './entities/item-venda.entity';
import { Venda } from './entities/venda.entity';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ProdutosModule } from 'src/produtos/produtos.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Venda, ItemVenda]),
  ClientesModule,
  ProdutosModule,
],
  controllers: [VendasController],
  providers: [VendasService],
})
export class VendasModule {}
