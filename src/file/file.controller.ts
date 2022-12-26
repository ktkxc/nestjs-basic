/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Delete,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { Response, Express } from 'express';
import { FileExistInterceptor } from '../common/file-exist.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('file上传')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() body: UploadFileDto,
  ) {
    console.log('uploadFile....');
    console.log(body);
    console.log(file);
    const arrre = await this.fileService.handleFileAndValue(req, [file]);
    console.log(arrre);
    return arrre;
  }
  @Post('uploads')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[],@Request() req, @Body() body) {
    console.log("uploadFile....");
    console.log(body);
    const arrre = await this.fileService.handleFileAndValue(req,files);
    console.log(arrre);
    return arrre;
  }
  @Get('download/:fileId')
  @UseInterceptors(FileExistInterceptor)
  download(@Param('fileId') fileId: string, @Res() response: Response) {
    this.fileService.downloadFile(fileId, response);
  }

  @Get('review/:fileId')
  @UseInterceptors(FileExistInterceptor)
  review(@Param('fileId') fileId: string, @Res() response: Response) {
    this.fileService.reviewFile(fileId, response);
  }

  @Delete(':fileId')
  @UseInterceptors(FileExistInterceptor)
  async remove(@Param('fileId') fileId: string) {
    console.log("fileid",fileId);
    await this.fileService.removeFile(fileId);
    return 'ok';
  }
}
