import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log(`Database connected`);
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  findAll() {
    return this.product.findMany({
      where: {
        available: true
      }
    });
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { 
        id,
        available: true
       }
    });

    if ( !product ){
      throw new NotFoundException(`Product with id #${ id } not found`)
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductDto
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product;
  }
}
