import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { CLIENTES_CONTRACT } from './clientes.contract';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [
    ClientesService,
    { provide: CLIENTES_CONTRACT, useExisting: ClientesService },
  ],
  exports: [CLIENTES_CONTRACT],
})
export class ClientesModule {}