
import { Module } from '@nestjs/common';
import { BedrockModule } from './bedrock/bedrock.module';

@Module({
  imports: [BedrockModule],
})
export class AppModule {}
