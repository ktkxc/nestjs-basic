import { Injectable } from '@nestjs/common';
import { createHash, Encoding } from 'crypto';
import fs = require('fs-extra');
import crypto = require('crypto');
@Injectable()
export class CryptoUtil {
  /**
   * 加密登录密码
   *
   * @param password 登录密码
   */
  encryptPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  /**
   * 检查登录密码是否正确
   *
   * @param password 登录密码
   * @param encryptedPassword 加密后的密码
   */
  checkPassword(password: string, encryptedPassword): boolean {
    const currentPass = this.encryptPassword(password);
    if (currentPass === encryptedPassword) {
      return true;
    }
    return false;
  }
  /**
   * 计算某个字符串的md5值
   * @param {string} str
   * @returns
   */
  md5_str(str, encoding: Encoding = 'utf8') {
    return crypto.createHash('md5').update(str, encoding).digest('hex');
  }
  /**
   * 计算某个文件的 MD5 值
   * @param {string} filepath 文件路径
   * @param {object} options 创建可读文件流的选项, 比如读取的字节范围
   * @returns
   */
  md5_file(filepath, options = {}) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filepath, options);
      const cryptoStream = crypto.createHash('md5');
      readStream.pipe(cryptoStream);
      // 通常, 可读流触发end事件时, 可写流也会触发 finish 事件
      cryptoStream.on('finish', () => {
        const md5Value = cryptoStream.digest('hex');
        resolve(md5Value);
      });
      readStream.on('error', (err) => {
        readStream.close();
        cryptoStream.end();
        reject(err);
      });
      readStream.on('data', () => {
        //console.log('chunk', chunk)
      });
    });
  }
}
