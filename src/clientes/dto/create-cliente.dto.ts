import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClienteDto {
    @IsString()
    @IsNotEmpty({ message: 'nome: obrigatório' })
    nome: string;

    @IsString()
    @IsNotEmpty({ message: 'CPF: obrigatório' })
    cpf: string;

    @IsString()
    @IsOptional()
    telefone?: string;
}
