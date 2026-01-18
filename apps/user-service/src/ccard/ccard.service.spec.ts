import { Test, TestingModule } from '@nestjs/testing';
import { CcardService } from './ccard.service';

describe('CcardService', () => {
  let service: CcardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CcardService],
    }).compile();

    service = module.get<CcardService>(CcardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
