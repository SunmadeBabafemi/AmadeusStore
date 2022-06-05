import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(
        private productservice: ProductService,
        @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy
    ){}
    
    @Get()
    async allProducts(){
        const allProducts = await this.productservice.allProducts()
        this.client.emit('all_products', allProducts)
       return allProducts 
    }

    @Post()
    async createProduct(@Body() product: CreateProductDto){
        const newProduct = await this.productservice.createProduct(product)
        this.client.emit('product_created', newProduct)
        return newProduct
    }

    @Get('/:id')
    async getAProduct(@Param('id', new ParseUUIDPipe()) id: string){
        const product = await this.productservice.findAProduct(id)
        if (!product){
            throw new NotFoundException('product not found')
        } 
        return product
    }
    
    @Put('/:id')
    async updateProduct(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body()body: UpdateProductDto
    ) {
        const updatedProduct = await this.productservice.updateProduct(id, body)
        this.client.emit('product_updated', updatedProduct)
        return updatedProduct
    }

    @Delete('/:id')
    async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string){
        this.client.emit('product_deleted', id)
        await this.productservice.deleteProduct(id)
        return 'Product successfully deleted'
    }

    @Post('/:id/like')
    async likeProduct(
        @Param('id', new ParseUUIDPipe()) id: string,
    ){
        const product = await this.productservice.findAProduct(id)
        if(!product){
            throw new NotFoundException('Product not found')
        }
        const updatedProduct = this.productservice.updateProduct(id, {likes: product.likes +1})
        return updatedProduct
    }

}   