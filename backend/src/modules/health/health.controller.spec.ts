import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return healthy status in envelope format', () => {
    const result = controller.check();
    expect(result).toBeDefined();
    expect(result.code).toBe(0);
    expect(result.message).toBe('OK');
    expect(result.data).toBeDefined();
    expect(result.data.status).toBe('healthy');
  });
});
