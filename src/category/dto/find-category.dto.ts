import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Category } from '../schema/category.schema';

export class FindCategoryDto extends PartialType(OmitType(Category, ['_id'])) {}
