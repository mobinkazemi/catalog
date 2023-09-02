import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from '../app.service';
import { Request as ExpressRequest } from 'express';
import { RoutesService } from 'src/routes/routes.service';
import { Route } from 'src/routes/schema/routes.schema';

@Controller('admin')
export class AdminAppController {
  constructor(private readonly appService: AppService) {}

  @Get('syncApi')
  async syncEndpoints(@Request() req: ExpressRequest) {
    await this.appService.syncApi(req);
  }
}
