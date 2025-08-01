import { IsString, IsOptional } from 'class-validator';

export class TtsDto {
    @IsString()
    text: string = '';

    @IsOptional()
    @IsString()
    voiceId?: string;  // optional
}
