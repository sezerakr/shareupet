import { Test, TestingModule } from '@nestjs/testing';
import { RehomingController } from './rehoming.controller';

describe('RehomingController', () => {
  let controller: RehomingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RehomingController],
    }).compile();

    controller = module.get<RehomingController>(RehomingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
