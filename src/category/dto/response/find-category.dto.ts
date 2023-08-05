import { PartialType } from '@nestjs/mapped-types';
import { Category } from 'src/category/schema/category.schema';

export class FindCategoryResponseDto extends PartialType(Category) {
  constructor(data?: Partial<Category>) {
    super();
    if (!data) data = {};
    this.id = data.id || data?._id?.toString();
    this.ord = data.ord;
    this.pid = data.pid;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
  }
}
