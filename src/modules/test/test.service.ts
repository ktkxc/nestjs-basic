import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ZgsyNest } from './entities/test.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(ZgsyNest)
    private readonly zgsynestRepository: Repository<ZgsyNest>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async createMany(body: ZgsyNest) {
    console.log('createMany...');
    //application/json;charset=utf-8
    console.log(body);
    let createZgsyNestDto = new ZgsyNest();
    createZgsyNestDto.name = body.name || 'name2' + Math.random();
    createZgsyNestDto.description = body.description || 'descr';
    createZgsyNestDto.filename = body.filename || 'filename';
    createZgsyNestDto.views = 1;
    createZgsyNestDto.createdate = new Date();
    createZgsyNestDto.ispublished = true;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // await queryRunner.query("");

      console.log(createZgsyNestDto);
      const objre = await queryRunner.manager.save(createZgsyNestDto);
      console.log('newid:' + objre.id);
      // queryRunner.enableSqlMemory();
      createZgsyNestDto = new ZgsyNest();
      createZgsyNestDto.name = randomUUID();
      createZgsyNestDto.description = '2description';
      createZgsyNestDto.filename = '2filename2';
      createZgsyNestDto.createdate = new Date();
      await queryRunner.manager.save(createZgsyNestDto);
      console.log(createZgsyNestDto);
      // console.log(queryRunner.getMemorySql())

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      //如果遇到错误，可以回滚事务
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      console.log('finally...');
      //你需要手动实例化并部署一个queryRunner
      await queryRunner.release();
    }
  }
  async findid(id: number) {
    return await this.zgsynestRepository.findOneBy({ id: id });
  }
  async findAll() {
    const queryBuilder = this.dataSource.createQueryBuilder();
    const a = await queryBuilder
      .select('zgsy_nest')
      // .select(["zgsy_nest.id","zgsy_nest.name","to_char(createdate::DATE,'yyyy-mm-dd HH24:mi') as createdate"])
      // .select(["id,name,description,filename,views,ispublished,to_char(createdate,'yyyy-mm-dd HH24:mi') as createdate0"])
      // .addSelect("to_char(createdate,'yyyy-mm-dd HH24:mi')","createdate")
      .from(ZgsyNest, 'zgsy_nest')
      .where('id>1')
      .limit(5)
      .offset(10)
      .orderBy('zgsy_nest.id', 'DESC')
      .getManyAndCount();
    // .getMany();
    console.log(queryBuilder.getSql());
    console.log(a);
    return a;
    return this.zgsynestRepository.query(
      "select id,name,to_char(createdate,'yyyy-mm-dd HH24:mi') createdate from zgsy_nest where id>1 order by id desc limit 6 offset 10",
    );
  }
}
