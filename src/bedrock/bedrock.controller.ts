import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BedrockService } from './bedrock.service';
import { EmbedTextDto } from './dto/embed-text.dto';
import { TtsDto } from './dto/tts.dto';

@Controller('bedrock')
export class BedrockController {
  constructor(private readonly bedrockService: BedrockService) { }

  @Get('generate')
  async generate(@Query('prompt') prompt: string): Promise<any> {
    return this.bedrockService.generateText(prompt);
  }

  @Post('embed')
  embedText(@Body() body: EmbedTextDto) {
    return this.bedrockService.embedText(body);
  }

  @Post('tts')
  async textToSpeech(@Body() body: TtsDto) {
    return this.bedrockService.textToSpeech(body);
  }
}
