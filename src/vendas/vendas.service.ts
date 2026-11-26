import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from './entities/venda.entity';
import { ItemVenda } from './entities/item-venda.entity';
import { CreateVendaDto } from './dto/create-venda.dto';
import { PRODUTOS_CONTRACT, type ProdutosContract } from '../produtos/produtos.contract';
import { CLIENTES_CONTRACT, type ClientesContract } from '../clientes/clientes.contract';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(Venda)
    private readonly vendaRepository: Repository<Venda>,

    @InjectRepository(ItemVenda)
    private readonly itemRepository: Repository<ItemVenda>,

    @Inject(PRODUTOS_CONTRACT)
    private readonly produtos: ProdutosContract,

    @Inject(CLIENTES_CONTRACT)
    private readonly clientes: ClientesContract,
  ) {}

  async create(createVendaDto: CreateVendaDto): Promise<Venda> {

    if(createVendaDto.clienteId) {
      await this.clientes.findOne(createVendaDto.clienteId);    
    }

    const itensParaSalvar: {
      produtoId: number;
      quantidade: number;
      precoUnitario: number;
      subtotal: number;
    }[] = [];
    let total = 0;

    for (const item of createVendaDto.itens){
      const produto = await this.produtos.findOne(item.produtoId);

      await this.produtos.baixarEstoque(item.produtoId, item.quantidade);

      const preco = Number(produto.preco);
      const subtotal = preco * item.quantidade;

      total += subtotal;

      itensParaSalvar.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: preco,
        subtotal,
      });
    }

    const venda = this.vendaRepository.create({
      valorTotal: total,
      clienteId: createVendaDto.clienteId,
      status: 'CONCLUIDA',
    });

    const vendaSalva = await this.vendaRepository.save(venda);

    for (const item of itensParaSalvar) {
      const itemVenda = this.itemRepository.create({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.subtotal,
        vendaId: vendaSalva.id,
      });
      await this.itemRepository.save(itemVenda);
    }

    return vendaSalva;
  }

  async findAll(): Promise<Venda[]> {
    return this.vendaRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Venda> {
    const venda = await this.vendaRepository.findOneBy({ id });
    if (!venda) {
      throw new NotFoundException(`Venda #${id} não encontrada`);
    }
    return venda;
  }

  async cancelar(id: number): Promise<Venda> {
    const venda = await this.findOne(id);

    if (venda.status === 'CANCELADA') {
      throw new BadRequestException('Venda já cancelada');
    }

    const itens = await this.itemRepository.findBy({ vendaId: id });

    for (const item of itens){
      await this.produtos.devolverEstoque(item.produtoId, item.quantidade)
    }
    
    venda.status = 'CANCELADA'
    return this.vendaRepository.save(venda)
  }
}