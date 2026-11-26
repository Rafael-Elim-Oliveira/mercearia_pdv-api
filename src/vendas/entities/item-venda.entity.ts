import { Produto } from "src/produtos/entities/produto.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Venda } from "./venda.entity";

@Entity('itens_venda')
export class ItemVenda {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    vendaId!: number;

    @Column()
    produtoId!: number;

    @Column()
    quantidade!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    precoUnitario!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal!: number;
}