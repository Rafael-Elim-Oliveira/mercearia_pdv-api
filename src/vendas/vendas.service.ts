import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venda } from './entities/venda.entity';
import { Repository } from 'typeorm';
import { ClientesService } from 'src/clientes/clientes.service';
import { ProdutosService } from 'src/produtos/produtos.service';
import { Produto } from 'src/produtos/entities/produto.entity';
import { ItemVenda } from './entities/item-venda.entity';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(Venda)
    private readonly vendaRepository: Repository<Venda>,
    private readonly clientesService: ClientesService,
    private readonly produtoService: ProdutosService,
  ) {}

  async create(createVendaDto: CreateVendaDto) {
    const venda = new Venda();
    venda.itens = [];
    let total = 0;

    if (createVendaDto.clienteId) {
      venda.cliente = await this.clientesService.findOne(createVendaDto.clienteId);
    }

    for (const itemDto of createVendaDto.itens) {
      const produto = await this.produtoService.findOne(itemDto.produtoId);

      if (produto.estoque < itemDto.quantidade) {
        throw new BadRequestException(`Etoque insuficiente de ${produto.nome}`);
      }
      
      await this.produtoService.update(produto.id, {
        estoque: produto.estoque - itemDto.quantidade,
      });

      const itemVenda = new ItemVenda();
      itemVenda.produto = produto;
      itemVenda.quantidade = itemDto.quantidade;
      itemVenda.precoUnitario = Number(produto.preco);
      itemVenda.subtotal = Number(produto.preco) * itemDto.quantidade;

      total +=itemVenda.subtotal;
      venda.itens.push(itemVenda);
  }
    venda.valorTotal = total;
    return this.vendaRepository.save(venda);
  }

  findAll() {
    return this.vendaRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const venda = await this.vendaRepository.findOneBy({ id });
    if(!venda) {
      throw new NotFoundException(`Venda #${id} não encontrada`);
    }
    return venda;
  }

  async cancelar (id: number) {
    const venda = await this.findOne(id);
    if (venda.status === 'CANCELADA') {
      throw new BadRequestException('Venda já cancelada');
    }

      for (const item of venda.itens) {
        const produto = await this.produtoService.findOne(item.produto.id);
        await this.produtoService.update(produto.id, {
          estoque: produto.estoque + item.quantidade,
        });
      }

      venda.status = 'CANCELADA';
      return this.vendaRepository.save(venda);
  }

  async remove(id: number) {
    const venda = await this.findOne(id);
    return this.vendaRepository.remove(venda);
  }
}
