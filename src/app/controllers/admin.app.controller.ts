import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from '../app.service';
import { Request as ExpressRequest } from 'express';

@Controller('admin')
export class AdminAppController {
  constructor(private readonly appService: AppService) {}

  @Get('syncApi')
  async syncEndpoints(@Request() req: ExpressRequest) {
    await this.appService.syncApi(req);
  }

  @Get('reloadApi')
  async reloadEndpoints() {
    await this.appService.reloadRoutes();
  }
}
