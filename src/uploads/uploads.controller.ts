import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {FileInterceptor} from '@nestjs/platform-express';
import {randomUUID} from 'crypto';
import {mkdir, unlink, writeFile} from 'fs/promises';
import {extname, join} from 'path';
import {JwtAuthGuard} from '../auth/auth.guard';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly config: ConfigService) {
  }

  @Post() @UseInterceptors(FileInterceptor('file', {limits: {fileSize: 50 * 1024 * 1024}}))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file || !/^(image|video)\//.test(file.mimetype)) throw new BadRequestException('Envie uma imagem ou vídeo de até 50 MB');
    const filename = `${Date.now()}-${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    const directory = join(process.cwd(), this.config.get('UPLOAD_DIR', 'uploads'));
    await mkdir(directory, {recursive: true});
    await writeFile(join(directory, filename), file.buffer);
    const baseUrl = this.config.get('API_PUBLIC_URL', 'http://localhost:3000').replace(/\/$/, '');
    return {
      path: filename,
      url: `${baseUrl}/uploads/${filename}`,
      type: file.mimetype,
      originalName: file.originalname
    };
  }

  @Post('images') @UseInterceptors(FileInterceptor('file', {
    limits: {fileSize: 10 * 1024 * 1024},
    fileFilter: (_request, file, callback) => callback(null, file.mimetype.startsWith('image/')),
  }))
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Envie uma imagem de até 10 MB');
    return this.upload(file);
  }

  @Delete(':filename') async remove(@Param('filename') filename: string) {
    if (filename !== filename.replace(/[^a-zA-Z0-9._-]/g, '')) throw new BadRequestException('Nome inválido');
    try {
      await unlink(join(process.cwd(), this.config.get('UPLOAD_DIR', 'uploads'), filename));
    } catch { /* idempotente */
    }
    return {deleted: true};
  }
}
