import { Body, Controller, Post, UseGuards ,Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req){        
        return await this.authService.loginWithCredentials(req.user);
    }
}
