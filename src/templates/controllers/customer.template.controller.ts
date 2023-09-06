import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotImplementedException,
  Req,
  Query,
} from '@nestjs/common';
import { TemplatesService } from '../templates.service';
import {
  CreatePartOfTemplateDto,
  CreateTemplateDto,
} from '../dto/request/create-template.dto';
import {
  UpdatePartOfTemplateDto,
  UpdateTemplateDto,
} from '../dto/request/update-template.dto';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { RolesGuard } from 'src/auth/strategy/role.strategy';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  refs,
} from '@nestjs/swagger';
import { FindTemplateWithFilesDto } from '../dto/response/find-one-with-file.dto';
import { RemovePartOfTemplateDto } from '../dto/request/remove-template.dto';
import {
  addListOptionsDto,
  findByIdDto,
} from 'src/common/dto/base-repository-dtos.dto';
import { FindTemplateListRequestDto } from '../dto/request/find-template.dto';
import { FindTemplateListResponseDto } from '../dto/response/find-list.dto';
import { GetPayload } from 'src/common/decorators/getUser.decorator';
import { getPayloadDecoratorDto } from 'src/users/dto/response/get-user-decorator.dto';

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
      show: 'all',
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
    return new FindTemplateWithFilesDto(result);
  }

  @ApiOperation({ summary: 'Update template' })
  @ApiBody({ type: UpdateTemplateDto })
  @Patch('update')
  async update(@Body() updateTemplateDto: UpdateTemplateDto) {
    return await this.templatesService.update(updateTemplateDto, {
      error: true,
    });
  }

  // ----- PART -----
  @ApiOperation({ summary: 'Create Part' })
  @ApiBody({ type: CreatePartOfTemplateDto })
  @Post('part/create')
  async createPart(@Body() createPartOfTemplateDto: CreatePartOfTemplateDto) {
    return this.templatesService.createPart(createPartOfTemplateDto);
  }

  @ApiOperation({ summary: 'Update part' })
  @Patch('part/update')
  async updatePart(@Body() data: UpdatePartOfTemplateDto) {
    return await this.templatesService.updatePart(data);
  }

  @ApiOperation({ summary: 'Delete Part' })
  @Delete('part/remove')
  async removePart(@Body() data: RemovePartOfTemplateDto) {
    return await this.templatesService.removePart(data);
  }
}
