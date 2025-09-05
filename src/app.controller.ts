import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  
  // Catch-all route for Vue Router (SPA routing)
  @Get('*')
  serveFrontend(@Res() res: Response) {
    // Don't serve index.html for API routes
    if (res.req.url.startsWith('/api/')) {
      return res.status(404).send('API endpoint not found');
    }
    
    // Serve index.html for all other routes (Vue Router will handle them)
    return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
