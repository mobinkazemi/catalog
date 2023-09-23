import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { TemplatesService } from '../templates.service';
import {
  CreatePartOfTemplateDto,
  CreateTemplateDto,
} from '../dto/request/create-template.dto';
import {
  UpdatePartOfTemplateDto,
  UpdateTemplateDtoByCustomer,
} from '../dto/request/update-template.dto';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { RolesGuard } from 'src/auth/strategy/role.strategy';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { RemovePartOfTemplateDto } from '../dto/request/remove-template.dto';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { FindTemplateListRequestDto } from '../dto/request/find-template.dto';
import { FindTemplateListResponseDto } from '../dto/response/find-list.dto';
import { GetPayload } from 'src/common/decorators/getUser.decorator';
import { getPayloadDecoratorDto } from 'src/users/dto/response/get-user-decorator.dto';
import { TemplateMessagesEnum } from '../enums/messages.enum';
import { PartialTemplateType } from '../types/partial-template.type';
import { ShowOptionEnum } from 'src/common/enums/show-option.enum';

@UseGuards(AuthGuard('jwt'))
@Controller('templates/customer')
export class TemplateCustomerController {
  constructor(private readonly templatesService: TemplatesService) {}

  @ApiOperation({ summary: 'Get template list by customer' })
  @Get('list')
  async findAll(
    @Query() listOptions: addListOptionsDto,
    @Query() data: FindTemplateListRequestDto,
    @GetPayload() payload: getPayloadDecoratorDto,
  ): Promise<Array<FindTemplateListResponseDto>> {
    data.ownerId = payload._id;
    const result = await this.templatesService.findAll(data, listOptions, {
      show: ShowOptionEnum.all,
    });
    return result.map((item) => new FindTemplateListResponseDto(item));
  }

  @ApiOperation({ summary: 'Get template info (with files info) by customer' })
  @Get(':id')
  async findOne(
    @Param() data: findByIdDto,
    @GetPayload() payload: getPayloadDecoratorDto,
  ) {
    const result = await this.templatesService.findOneWithFiles(
      { id: data.id, ownerId: payload._id },
      { error: true },
    );
    return result;
  }

  @ApiOperation({ summary: 'Update template by customer' })
  @ApiBody({ type: UpdateTemplateDtoByCustomer })
  @Patch('update')
  async update(
    @Body() updateTemplateDto: UpdateTemplateDtoByCustomer,
    @GetPayload() payload: getPayloadDecoratorDto,
  ) {
    const { templateId: id } = updateTemplateDto;
    delete updateTemplateDto.templateId;

    return await this.templatesService.update(
      { id: id as string, ownerId: payload.id },
      updateTemplateDto as PartialTemplateType,
    );
  }

  // ----- PART -----
  @ApiOperation({ summary: 'Create Part by customer' })
  @ApiBody({ type: CreatePartOfTemplateDto })
  @Post('part/create')
  async createPart(
    @Body() data: CreatePartOfTemplateDto,
    @GetPayload() payload: getPayloadDecoratorDto,
  ) {
    try {
      await this.templatesService.findOne(
        {
          id: data.templateId as string,
          ownerId: payload._id,
        },
        { error: true },
      );
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new ForbiddenException(
          TemplateMessagesEnum.TEMPLATE_FORBIDDEN_CHANGES,
        );
      }

      throw error;
    }
    return await this.templatesService.createPart(data);
  }

  @ApiOperation({ summary: 'Update part by customer' })
  @Patch('part/update')
  async updatePart(
    @Body() data: UpdatePartOfTemplateDto,
    @GetPayload() payload: getPayloadDecoratorDto,
  ) {
    try {
      await this.templatesService.findOne(
        {
          id: data.templateId as string,
          ownerId: payload._id,
        },
        { error: true },
      );
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new ForbiddenException(
          TemplateMessagesEnum.TEMPLATE_FORBIDDEN_CHANGES,
        );
      }

      throw error;
    }
    return await this.templatesService.updatePart(data);
  }

  @ApiOperation({ summary: 'Delete Part by customer' })
  @Delete('part/remove')
  async removePart(
    @Body() data: RemovePartOfTemplateDto,
    @GetPayload() payload: getPayloadDecoratorDto,
  ) {
    try {
      await this.templatesService.findOne(
        {
          id: data.templateId as string,
          ownerId: payload._id,
        },
        { error: true },
      );
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new ForbiddenException(
          TemplateMessagesEnum.TEMPLATE_FORBIDDEN_CHANGES,
        );
      }

      throw error;
    }
    return await this.templatesService.removePart(data);
  }
}
