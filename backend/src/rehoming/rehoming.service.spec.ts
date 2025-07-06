import { Test, TestingModule } from '@nestjs/testing';
import { RehomingService } from './rehoming.service';

describe('RehomingService', () => {
  let service: RehomingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RehomingService],
    }).compile();

    service = module.get<RehomingService>(RehomingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
