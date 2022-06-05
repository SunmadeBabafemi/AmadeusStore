import {IsOptional} from "class-validator"

export class UpdateProductDto{
    @IsOptional()
    title: string

    @IsOptional()
    imgAd: string

}