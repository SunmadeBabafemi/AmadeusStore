import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/createProduct.dto';
import { Product, ProductDocument } from '../models/product.model';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) 
        private readonly productModel: Model<ProductDocument>
    ){}

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec()
    }

    async findOne(id: string):Promise<Product>{
        const product = await this.productModel.findOne({id})
        return product
    }

    async create(item: CreateProductDto): Promise<Product>{
        const product = await (await this.productModel.create(item)).save()
        return product
    }

    async update(id:string, attrs: Partial<Product>):Promise<any>{
        const product:Product = await this.productModel.findOne({id:id})
        if(!product){
            throw new BadRequestException('update could not be performed')
        }
        const updatedProduct = await this.productModel.findOneAndUpdate({id}, attrs)
        return updatedProduct

    }

    async delete(id: string){
        const product = await this.productModel.findOne({id:id})
        if(!product){
            throw new NotFoundException('product not found')
        } 
        await this.productModel.deleteOne({id:id})
        return 'Product successfully deleted'
    }
}
