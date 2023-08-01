import { OmitType } from '@nestjs/mapped-types';
import { Part, Template } from 'src/templates/schema/templates.schema';
import { File } from '../../../files/schema/files.schema';

class populatedPart extends OmitType(Part, ['_id', 'fileId']) {
  fileId: File & { id: string };
  constructor(data: any) {
    super();
    if (!data) data = {};

    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.fileId = data.fileId;
    this.id = data.id;
    this.link = data.link;
    this.ord = data.ord;
    this.pid = data.pid;
    this.position = data.position;
    this.text = data.text;
    this.title = data.title;
    this.updatedAt = data.updatedAt;

    if (this.fileId) {
      this.fileId.id = this.fileId._id.toString();

      delete this.fileId._id;
    }
  }
}
export class FindTemplateWithFilesDto extends OmitType(Template, [
  '_id',
  'backgroundFileId',
  'parts',
]) {
  backgroundFileId: File & { id: string };
  parts: populatedPart[];

  constructor(data: any) {
    super();
    if (!data) data = {};

    this.id = data._id;
    this.name = data.name;
    this.pid = data.pid;
    this.ord = data.ord;
    this.backgroundColor = data.backgroundColor;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.updatedAt = data.updatedAt;
    if (data.parts) {
      this.parts = data.parts.map((part) => new populatedPart(part));
    }
    if (data.backgroundFileId) {
      this.backgroundFileId = data.backgroundFileId;
      this.backgroundFileId.id = this.backgroundFileId._id.toString();

      delete this.backgroundFileId._id;
    }
  }
}
