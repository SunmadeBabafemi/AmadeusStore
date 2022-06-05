import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductService } from './product.service';
import { HttpService } from '@nestjs/axios';


@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService,
        private httpService: HttpService
    ){}
    
    @Get()
    findall(){
        return this.productService.findAll()
    }
    @Post('/:id/like')
    async like(@Param('id', new ParseUUIDPipe()) id: string){
        const product = await this.productService.findOne(id)  
        this.httpService.post(`http://localhost:8000/api/v1/products/${id}/like`, {}).subscribe(
            res =>{
                console.log(res)
            }
        ) 
        const updatedProduct = this.productService.update(id, {likes: product.likes+1})
        return updatedProduct
    }

    @EventPattern('product_created')
    async createProduct(prod: CreateProductDto){
        return await this.productService.create(prod)
    }

    @EventPattern('all_products')
    async allProducts(){
        return await this.productService.findAll()
    }

    @EventPattern('product_updated')
    async updateAProduct(body: any){
        return await this.productService.update(body.id, {...body} )
    }

    @EventPattern('product_deleted')
    async deleteProduct(id:string){
        return await this.productService.delete(id)
    }
}
