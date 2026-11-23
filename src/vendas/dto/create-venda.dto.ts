import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsInt, IsOptional, IsPositive, ValidateNested } from "class-validator";

export class ItemVendaDto {
    @IsInt()
    @IsPositive()
    produtoId: number;

    @IsInt()
    @IsPositive()
    quantidade: number;
}

export class CreateVendaDto {
    @IsInt()
    @IsOptional()
    clienteId?: number;
    
    @IsArray()
    @ArrayMinSize(1, { message: 'venda: pelo menos 1 item'})
    @ValidateNested({ each: true })
    @Type(() => ItemVendaDto)
    itens: ItemVendaDto[];
}
