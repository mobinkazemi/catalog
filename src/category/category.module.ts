import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './controllers/admin.category.controller';
import { CategorysRepository } from './category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategorysRepository],
})
export class CategoryModule {}
