import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('cliente')
export class Cliente {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column({ unique: true })
    cpf!: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    telefone!: string | null;
}
