import { Test, TestingModule } from '@nestjs/testing';
import { CcardController } from './ccard.controller';

describe('CcardController', () => {
  let controller: CcardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CcardController],
    }).compile();

    controller = module.get<CcardController>(CcardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
