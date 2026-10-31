import { BadRequestException, Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/mongoose';
import { SkipThrottle } from '@nestjs/throttler';
import { isValidObjectId, Model } from 'mongoose';
import { AdminGuard } from '../auth/jwt-auth.guard';
import { detectImageType } from './image-type';
import { Upload, UploadDocument } from './upload.schema';

const MAX_BYTES = 3 * 1024 * 1024;

@Controller('uploads')
export class UploadsController {
  constructor(@InjectModel(Upload.name) private model: Model<UploadDocument>) {}

  // admin only: JPEG, PNG or WebP up to 3 MB
  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_BYTES, files: 1 } }))
  async upload(@UploadedFile() file: { buffer: Buffer; size: number } | undefined) {
    if (!file) throw new BadRequestException('No image received');
    const contentType = detectImageType(file.buffer);
    if (!contentType) throw new BadRequestException('Only JPEG, PNG or WebP images are allowed');
    const doc = await this.model.create({ data: file.buffer, contentType, size: file.size });
    return { url: `/uploads/${doc.id}` };
  }

  // public: product photos
  @SkipThrottle()
  @Get(':id')
  async get(@Param('id') id: string, @Res() res: any) {
    if (!isValidObjectId(id)) throw new NotFoundException();
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException();
    const data: Buffer = (doc.data as any)?.buffer ?? (doc.data as any);
    res.set({
      'Content-Type': doc.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      // the website lives on another domain, so these images must be allowed to load cross-origin
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'X-Content-Type-Options': 'nosniff',
    });
    res.send(Buffer.from(data));
  }
}
