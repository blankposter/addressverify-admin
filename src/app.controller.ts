import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  
  // Specific routes for Vue Router (SPA routing)
  @Get(['/', '/login', '/dashboard', '/users', '/credits', '/requests', '/packages', '/2fa-setup'])
  serveFrontend(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
