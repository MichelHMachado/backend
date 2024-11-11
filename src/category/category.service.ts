import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { Transaction } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    transaction?: Transaction,
  ) {
    const category = await this.categoryModel.create(createCategoryDto, {
      transaction,
    });
    return category;
  }

  async findAll() {
    const categories = await this.categoryModel.findAll();
    return categories;
  }

  async findOne(uuid: string) {
    const category = await this.categoryModel.findByPk(uuid);
    return category;
  }

  async findByName(name: string, transaction?: Transaction) {
    const category = await this.categoryModel.findOne({
      where: { name },
      transaction,
    });
    return category;
  }

  async update(uuid: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryModel.update(updateCategoryDto, { where: { uuid } });
    return await this.categoryModel.findByPk(uuid);
  }

  async remove(uuid: string) {
    const category = await this.categoryModel.findByPk(uuid);
    if (!category) {
      throw new Error('Category not found');
    }
    await category.destroy();
  }
}
