// file.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

@Injectable()
export class FileService {
  async downloadImage(url: string, filePath: string): Promise<void> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const directoryName = dirname(filePath);

    if (!existsSync(directoryName)) {
      mkdirSync(directoryName);
    }
    writeFileSync(filePath, response.data);
  }
}
