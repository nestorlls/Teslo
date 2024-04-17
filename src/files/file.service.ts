import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticFile(imageName: string) {
    const path = join(__dirname, '../../static/uploads', imageName);
    if (!path)
      throw new BadRequestException(`No image with name ${imageName} found`);
    return path;
  }
}
