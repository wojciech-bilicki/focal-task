import { Controller, Get, Query, Res } from '@nestjs/common';
import { FileService } from './file.service';
import hashCode from './utils/hasCode';
import { join } from 'path';

import { existsSync } from 'fs';

@Controller('')
export class AppController {
  constructor(private readonly fileService: FileService) {}

  @Get('images')
  async getImage(@Query('url') url: string) {
    const urlHash = hashCode(url);
    const filename = urlHash + '.jpg';
    const filePath = join(__dirname, '../public', filename);

    if (!existsSync(filePath)) {
      await this.fileService.downloadImage(url, filePath);
    }
    return { url: filename };
  }
}
