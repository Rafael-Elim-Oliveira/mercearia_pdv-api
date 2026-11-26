import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemVenda } from "./item-venda.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";

@Entity('vendas')
export class Venda {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    data!: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    valorTotal!: number;

    @Column({ default: 'CONCLUIDA'})
    status!: string;

    @Column({ type: 'numeric', nullable: false })
    clienteId!: number; 
}
