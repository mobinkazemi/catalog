import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplateAdminController } from './controllers/admin.templates.controller';
import { TemplatesRepository } from './templates.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schema/templates.schema';
import { TemplateCustomerController } from './controllers/customer.template.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
  ],
  controllers: [TemplateAdminController, TemplateCustomerController],
  providers: [TemplatesService, TemplatesRepository],
})
export class TemplatesModule {}
