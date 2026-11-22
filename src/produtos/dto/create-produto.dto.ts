import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProdutoDto {
    @IsString()
    @IsNotEmpty({ message: 'nome do produto: obrigatório'})
    nome: string;

    @IsNumber()
    @IsPositive({ message: 'preço: maior que zero'})
    preco: number;

    @IsInt()
    @Min(0, { message: 'estoque: maior ou igual a zero'})
    estoque: number;
}
