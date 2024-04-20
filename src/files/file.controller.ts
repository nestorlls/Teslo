import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { diskStorage } from 'multer';
import { Response } from 'express';

import { FilesService } from './file.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly fileService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findOne(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.fileService.getStaticFile(imageName);
    res.sendFile(path);
  }

  @Post('upload')
  @ApiResponse({ status: 201, description: 'File was uploaded' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer,
      }),
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File not found');

    const port = this.configService.get('PORT');
    const hostApi = this.configService.get('API_PREFIX');
    const url = `http://localhost:${port}/${hostApi}/files/product/${file.filename}`;

    return { url };
  }
}
