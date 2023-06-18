// file.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { writeFileSync } from 'fs';

@Injectable()
export class FileService {
  async downloadImage(
    url: string,
    filename: string,
    filePath: string,
  ): Promise<void> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    writeFileSync(filePath, response.data);
  }
}
