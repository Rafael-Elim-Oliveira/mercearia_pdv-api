import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { PRODUTOS_CONTRACT } from './produtos.contract';

@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [ProdutosController],
  providers: [
    ProdutosService,
    { provide: PRODUTOS_CONTRACT, useExisting: ProdutosService },
  ],
  exports: [PRODUTOS_CONTRACT],
})
export class ProdutosModule {}