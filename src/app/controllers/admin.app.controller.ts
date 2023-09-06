import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { AppService } from '../app.service';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class AdminAppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get('syncApi')
  async syncEndpoints(@Request() req: ExpressRequest) {
    await this.appService.syncApi(req);
  }

  @Get('reloadApi')
  async reloadEndpoints() {
    await this.appService.reloadRoutes();
  }

  @Get('postman')
  async postman(@Res() res) {
    const port = this.configService.get('port');
    return await res.redirect(`http://localhost:${port}/docs-json`);
  }
}
