import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendasService } from './vendas.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  create(@Body() createVendaDto: CreateVendaDto) {
    return this.vendasService.create(createVendaDto);
  }

  @Get()
  findAll() {
    return this.vendasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendasService.findOne(+id);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.vendasService.cancelar(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendasService.remove(+id);
  }
}
