import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplateAdminController } from './controllers/admin.templates.controller';
import { TemplatesRepository } from './templates.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schema/templates.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
  ],
  controllers: [TemplateAdminController],
  providers: [TemplatesService, TemplatesRepository],
})
export class TemplatesModule {}
