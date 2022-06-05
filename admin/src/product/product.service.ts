import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../database/repository/product.repository';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
    constructor(
        private productRepo: ProductRepository
    ){}

    async allProducts(): Promise<Product[]>{
        const allProducts = await this.productRepo.find()
        return allProducts
    }

    async createProduct(prod: CreateProductDto): Promise<Product>{
        const product = this.productRepo.create(prod)
        const newProduct = await this.productRepo.save(product)
        return newProduct
    }

    async findAProduct(id: string){
        if(!id){
             throw new NotFoundException({description:"product not found"})
        }
        const foundProduct = await this.productRepo.findOne(id)
        return foundProduct
    }

    async updateProduct(id: string, attrs: Partial<Product>){
        const product = await this.productRepo.findOne(id)
        if(!product){
            throw new NotFoundException('product not found')
        }
        Object.assign(product, attrs)
        return this.productRepo.save(product)
    }

    async deleteProduct(id: string){
        const product = await this.productRepo.findOne(id)
        if(!product){
            throw new NotFoundException('product not found')
        } 
        await this.productRepo.remove(product)
        return 'Product successfully deleted' 
    }
}
