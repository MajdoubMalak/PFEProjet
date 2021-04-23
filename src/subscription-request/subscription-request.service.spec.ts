import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionRequestService } from './subscription-request.service';

describe('SubscriptionRequestService', () => {
  let service: SubscriptionRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionRequestService],
    }).compile();

    service = module.get<SubscriptionRequestService>(SubscriptionRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
