import { Module } from '@nestjs/common';
import { ConsumerFactory } from './consumer.factory';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  providers: [ConsumerFactory],
})
export class MessageModule {}
