import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutosContract } from './produtos.contract'; 
import { CreateProdutoDto } from './dto/create-produto.dto';

@Injectable()
export class ProdutosService implements ProdutosContract {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  create(createProdutoDto: CreateProdutoDto) {
    const produto = this.produtoRepository.create(createProdutoDto);
    return this.produtoRepository.save(produto);
  }

  findAll() {
    return this.produtoRepository.find();
  }

  async findOne(id: number) {
    const produto = await this.produtoRepository.findOneBy({ id });
    if(!produto) {
      throw new NotFoundException("Produto não encontrado.");
    }

    return produto;
  }

  async baixarEstoque(id: number, quantidade: number): Promise<void> {
    const produto = await this.findOne(id);

    if (produto.estoque < quantidade) {
      throw new BadRequestException(`Estoque insuficiente de ${produto.nome}`);
    }

    produto.estoque -= quantidade;
    await this.produtoRepository.save(produto);
  }

  async devolverEstoque(id: number, quantidade: number): Promise<void> {
    const produto = await this.findOne(id);

    produto.estoque += quantidade;
    await this.produtoRepository.save(produto);
  }
}