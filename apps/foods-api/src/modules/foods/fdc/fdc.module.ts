import { Module } from '@nestjs/common';
import { FdcService } from './fdc.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      baseURL: process.env.FDC_API_URL,
      headers: {
        'X-Api-Key': process.env.FDC_API_KEY,
      },
    }),
  ],
  providers: [FdcService],
  exports: [FdcService],
})
export class FdcModule {}
