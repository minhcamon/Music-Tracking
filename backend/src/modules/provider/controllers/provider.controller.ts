import { Controller, Get, Query } from '@nestjs/common';
import { ApiPaths } from '../../../common/constants/api-paths.constant';
import { ProviderService } from '../services/provider.service';
import { ProviderStatusDto } from '../dto/provider-status.dto';

@Controller(ApiPaths.PROVIDERS)
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  async getProviders(
    @Query('userId') userId?: string,
  ): Promise<ProviderStatusDto[]> {
    return this.providerService.listConnections(userId);
  }
}
