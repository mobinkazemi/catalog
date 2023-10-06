import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryAdminController } from './controllers/admin.category.controller';
import { CategorysRepository } from './category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';
import { CategoryController } from './controllers/category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryAdminController, CategoryController],
  providers: [CategoryService, CategorysRepository],
})
export class CategoryModule {}
