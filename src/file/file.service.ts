/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Inject,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import path = require('path');
import mime = require('mime');
import fs = require('fs');
import Jimp = require('jimp');
import { ResourceHandler } from '../common/resource-handler/resource-handler';
import { randomUUID } from 'crypto';
import { CryptoUtil } from '../common/utils/crypto.util';
import { MyLogger } from '../common/utils/mylogger';
@Injectable()
export class FileService {
  constructor(
    private readonly utils: CryptoUtil,
    @Inject(MyLogger) private readonly mylogger: MyLogger,
    private readonly resourceHandler: ResourceHandler,
  ) {}

  async completeFileDestinationHandler(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination?: string) => void,
  ) {
    const filename = file.originalname;
    const ftype = req.query.ftype;
    // const md5 = req.body.md5||"";
    console.log('completeFileDestinationHandler....');
    // console.log(req.params);
    // console.log(req.query);
    // console.log(ftype);
    const { mimetype } = file;
    // console.log(mimetype);
    if (ftype) {
      if (!mimetype.includes(ftype.toString())) {
        return cb(new BadRequestException('不符合上传文件类型' + ftype + '！'));
      }
    }
    // if (!md5) return cb(new BadRequestException('缺少 md5 值参数'));
    // filename + MD5 重新计算 md5 , 得到唯一 fileId
    const md5 = randomUUID();
    const encodeStr = this.getEncodeStr({ md5, filename });
    const d = new Date();
    const m = String(d.getMonth());
    const fileId =
      d.getFullYear() +
      (m.length == 2 ? m : '0' + m) +
      this.utils.md5_str(encodeStr);
    const arrf = filename.split('.');
    const newfilename =
      d.getTime() + (arrf.length > 1 ? '.' + arrf[arrf.length - 1] : '');
    file['filename'] = newfilename;
    file['fileid'] = fileId;
    file['url'] = this.resourceHandler.getFileUploadUrl(fileId, newfilename);
    // console.log(req.body)
    cb(null, await this.resourceHandler.getFileDir(fileId, true));
  }

  completeFileNameHandler(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination?: string) => void,
  ) {
    console.log('completeFileNameHandler....');
    cb(null, `${file.filename || file.originalname}`);
  }
  async handleFileAndValue(req: Request, files: Express.Multer.File[]) {
    const arrre = [];
    for (const file of files) {
      console.log(file);
      const { mimetype } = file;
      if (mimetype.includes('image')) {
        // console.log("处理图片",mimetype)
        let filefullname = file.path;
        let objlenna = null;
        if (file.size / 1024 > 1000) {
          //变小
          const objresize = await this.jimpresize(filefullname, {
            autow: 1080,
          });
          objlenna = objresize.lenna;
          if (file.filename.indexOf('.png') >= 0) {
            file.filename = file.filename.replace('.png', '.jpg');
            file['url'] = file['url'].replace('.png', '.jpg');
            filefullname = filefullname.replace('.png', '.jpg');
            file.path = file.path.replace('.png', '.jpg');
          }
          const oldsize = file.size;
          if (fs.existsSync(filefullname)) {
            // console.log("filefullname",filefullname);
            const data = fs.statSync(filefullname || file.path);
            file.size = data.size;
          }
          this.mylogger.info(
            filefullname + '调整图片大小' + oldsize + '->' + file.size,
            req,
          );
        }
        const objcutfilename = this.resourceHandler.getFileCutfilename(
          file['fileid'],
          file.filename,
        );
        const objc = await this.jimpcover(
          filefullname,
          objcutfilename.curfilename,
          {
            cutw: 100,
            cuth: 100,
          },
          objlenna,
        );
        if (objc.url) {
          file['surl'] = objcutfilename.surl;
        }
      }
      arrre.push({
        url: file['url'],
        surl: file['surl'],
        fileid: file['fileid'],
        size: file.size,
        original: file.originalname,
        filename: file.filename,
      });
    }
    return arrre;
  }
  async jimpresize(filename, objModal): Promise<any> {
    const autow = Math.floor(objModal.autow || 1080);
    // var autoh=Math.floor(objModal.autoh||0);
    const myP = await new Promise(function (resolve, reject) {
      // console.log("jimpresize..."+autow)
      Jimp.read(filename)
        .then(function (lenna) {
          const savefilename =
            filename.indexOf('.png') >= 0
              ? filename.replace('.png', '.jpg')
              : filename;
          lenna
            .resize(autow, Jimp.AUTO)
            .quality(90)
            .write(savefilename, function () {
              resolve({ lenna: lenna });
            });
          // console.log("resize..."+savefilename)
        })
        .catch((err) => {
          throw new HttpException(err, 500);
        });
    });
    return myP;
  }
  async jimpcover(filename, cutfilename, objModal, objlenna): Promise<any> {
    const self = this;
    const myP = await new Promise(function (resolve) {
      if (objlenna) {
        self.jimpcoverchild(
          filename,
          cutfilename,
          objModal,
          objlenna,
          resolve,
        );
      } else {
        Jimp.read(filename)
          .then(function (lenna) {
            self.jimpcoverchild(
              filename,
              cutfilename,
              objModal,
              lenna,
              resolve,
            );
          })
          .catch((err) => {
            throw new HttpException(err, 500);
          });
      }
    });
    return myP;
  }
  async jimpcoverchild(filename, cutfilename, objModal, lenna, resolve) {
    let cutw = Math.floor(objModal.cutw || 0);
    let cuth = Math.floor(objModal.cuth || 0);
    if (cutw > lenna.bitmap.width) {
      cutw = lenna.bitmap.width;
      if (cuth) {
        cuth = (cutw * cuth) / Math.floor(objModal.cutw || 0);
      }
    }
    if (cuth == 0) {
      cuth = (cutw * lenna.bitmap.height) / lenna.bitmap.width;
    } else if (cutw == 0) {
      //按高度 宽度自适应
      cutw = (cuth * lenna.bitmap.width) / lenna.bitmap.height;
    }
    lenna
      .cover(cutw, cuth) // resize
      .quality(80) // set JPEG quality
      // .greyscale()                 // set greyscale
      .write(cutfilename, function () {
        resolve({ url: filename, surl: cutfilename, lenna: lenna });
      });
  }

  async downloadFile(fileId: string, response: Response) {
    const filePath = await this.resourceHandler.getFileByFileId(fileId);
    // 下载文件 (内部使用流)
    response.download(filePath, `${path.basename(filePath)}`, async (err) => {
      if (err) {
        this.mylogger.error(`下载文件 ${filePath} 失败, ${err}`);
      }
    });
  }

  async reviewFile(fileId: string, response: Response) {
    const filePath = await this.resourceHandler.getFileByFileId(fileId);
    // console.log('reviewFile:',filePath);
    const contentType = mime.getType(filePath);
    response.set('Content-Type', contentType);
    fs.createReadStream(filePath)
      .pipe(response)
      .on('error', (err) => {
        this.mylogger.error(`预览文件 ${filePath} 失败, ${err}`);
      });
  }

  async removeFile(fileId: string) {
    const dirPath = await this.resourceHandler.getFileDir(fileId);
    console.log('removeFile:',dirPath);
    await this.resourceHandler.removeFileOrDir(dirPath);
  }

  getEncodeStr({ filename, md5 }): string {
    return `${md5}_${filename}`;
  }
}
