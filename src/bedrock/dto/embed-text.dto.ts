import { IsString } from 'class-validator';

export class EmbedTextDto {
    @IsString()
    text: string = '';
}
