import { PartialType } from '@nestjs/mapped-types';
import { Template } from 'src/templates/schema/templates.schema';

export class FindTemplateListResponseDto extends PartialType(Template) {
  constructor(data: Partial<Template>) {
    super();

    this._id = data._id;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.expiredAt = data.expiredAt;
    this.categoryId = data.categoryId;
  }
}
