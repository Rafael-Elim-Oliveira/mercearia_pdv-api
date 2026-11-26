import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venda } from './entities/venda.entity';
import { ItemVenda } from './entities/item-venda.entity';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { ProdutosModule } from '../produtos/produtos.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venda, ItemVenda]),
    ProdutosModule,
    ClientesModule,
  ],
  controllers: [VendasController],
  providers: [VendasService],
})
export class VendasModule {}