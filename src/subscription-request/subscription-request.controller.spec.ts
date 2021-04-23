import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionRequestController } from './subscription-request.controller';

describe('SubscriptionRequestController', () => {
  let controller: SubscriptionRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionRequestController],
    }).compile();

    controller = module.get<SubscriptionRequestController>(SubscriptionRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
