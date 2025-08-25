
import { Injectable } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { VoiceId } from '@aws-sdk/client-polly';
import { EmbedTextDto } from './dto/embed-text.dto';
import { TtsDto } from './dto/tts.dto';
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { Readable } from 'stream';


@Injectable()
export class BedrockService {
  private client = new BedrockRuntimeClient({
    region: "us-east-2",
    credentials: fromIni({ profile: "277707123286_PowerUserAccess" })
  });

  private polly = new PollyClient({
    region: "us-east-2",
    credentials: fromIni({ profile: "277707123286_PowerUserAccess" })
  });

  /* WORKING CODE FOR Llama 3.3 70B Instruct */
  /*
  async generateText(prompt: string, modelId = 'meta.llama3-3-70b-instruct-v1:0') {
    const body = JSON.stringify({
      prompt,
      max_gen_len: 100,
      temperature: 0.7,
      top_p: 0.9
    });


    const command = new InvokeModelCommand({
      body: new TextEncoder().encode(body),
      contentType: 'application/json',
      accept: 'application/json',
      modelId,
    });

    const response = await this.client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    return JSON.parse(responseBody);
  } */

  /* WORKING CODE FOR Llama 3.2 90B Instruct */
  /*
  async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.meta.llama3-2-90b-instruct-v1:0') {
    const body = JSON.stringify({
      prompt,
      max_gen_len: 100,
      temperature: 0.7,
      top_p: 0.9
    });


    const command = new InvokeModelCommand({
      body: new TextEncoder().encode(body),
      contentType: 'application/json',
      accept: 'application/json',
      modelId,
    });

    const response = await this.client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    return JSON.parse(responseBody);
  } */

  /* WORKING CODE FOR Llama 4 Scout 17B Instruct */
  /*
  async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.meta.llama4-scout-17b-instruct-v1:0') {
    const body = JSON.stringify({
      prompt,
      max_gen_len: 100,
      temperature: 0.7,
      top_p: 0.9
    });


    const command = new InvokeModelCommand({
      body: new TextEncoder().encode(body),
      contentType: 'application/json',
      accept: 'application/json',
      modelId,
    });

    const response = await this.client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    return JSON.parse(responseBody);
  } */

  /* WORKING CODE FOR Llama 4 Maverick 17B Instruct */
  /*
  async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.meta.llama4-maverick-17b-instruct-v1:0') {
    const body = JSON.stringify({
      prompt,
      max_gen_len: 100,
      temperature: 0.7,
      top_p: 0.9
    });


    const command = new InvokeModelCommand({
      body: new TextEncoder().encode(body),
      contentType: 'application/json',
      accept: 'application/json',
      modelId,
    });

    const response = await this.client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    return JSON.parse(responseBody);
  } */

  /* WORKING CODE FOR Claude 3 Haiku */
  /* 
    async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.anthropic.claude-3-haiku-20240307-v1:0') {
      const body = JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [{ type: "text", text: prompt }]
        }]
      });
  
      const command = new InvokeModelCommand({
        modelId,
        body: new TextEncoder().encode(body),
        contentType: 'application/json',
        accept: 'application/json',
      });
  
      const response = await this.client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      return JSON.parse(responseBody);
    }
    */

  /*WORKING CODE for Claude Sonnet 3.5 */

  /* 
    async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0') {
      const body = JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [{ type: "text", text: prompt }]
        }]
      });
  
      const command = new InvokeModelCommand({
        modelId,
        body: new TextEncoder().encode(body),
        contentType: 'application/json',
        accept: 'application/json',
      });
  
      const response = await this.client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      return JSON.parse(responseBody);
    } */

  /* WORKING CODE FOR Nova Lite */
  /* 
    async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.amazon.nova-lite-v1:0') {
      const body = JSON.stringify({
        messages: [{
          role: "user",
          content: [{ text: prompt }]
        }]
      });
  
      const command = new InvokeModelCommand({
        modelId,
        body: new TextEncoder().encode(body),
        contentType: 'application/json',
        accept: 'application/json',
      });
  
      const response = await this.client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      return JSON.parse(responseBody);
    } */

  /* WORKING CODE FOR Nova Micro */
  /*
  async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.amazon.nova-micro-v1:0') {
    const body = JSON.stringify({
      messages: [{
        role: "user",
        content: [{ text: prompt }]
      }]
    });

    const command = new InvokeModelCommand({
      modelId,
      body: new TextEncoder().encode(body),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await this.client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    return JSON.parse(responseBody);
  } */

  /* WORKING CODE FOR Nova Premier */
  /*
  async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.amazon.nova-premier-v1:0') {
    const body = JSON.stringify({
      messages: [{
        role: "user",
        content: [{ text: prompt }]
      }]
    });

    const command = new InvokeModelCommand({
      modelId,
      body: new TextEncoder().encode(body),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await this.client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    return JSON.parse(responseBody);
  } */

  /* WORKING CODE FOR Nova Pro */
  /*
  async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.amazon.nova-pro-v1:0') {
    const body = JSON.stringify({
      messages: [{
        role: "user",
        content: [{ text: prompt }]
      }]
    });

    const command = new InvokeModelCommand({
      modelId,
      body: new TextEncoder().encode(body),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await this.client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    return JSON.parse(responseBody);
  } */

  /* WORKING CODE FOR Pixtral Large */
  async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.mistral.pixtral-large-2502-v1:0') {
    const body = JSON.stringify({
      messages: [{
        role: "user",
        content: [{ type: "text", text: prompt }]
      }]
    });

    const command = new InvokeModelCommand({
      modelId,
      body: new TextEncoder().encode(body),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await this.client.send(command);
    const responseBody = new TextDecoder().decode(response.body);
    return JSON.parse(responseBody);
  }

  /* WORKING CODE FOR Claude Sonnet 3.7 */
  /*
    async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.anthropic.claude-3-7-sonnet-20250219-v1:0') {
      const body = JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [{ type: "text", text: prompt }]
        }]
      });
  
      const command = new InvokeModelCommand({
        modelId,
        body: new TextEncoder().encode(body),
        contentType: 'application/json',
        accept: 'application/json',
      });
  
      const response = await this.client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      return JSON.parse(responseBody);
    } */


  async embedText({ text }: EmbedTextDto) {
    const input = {
      modelId: 'amazon.titan-embed-text-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({ inputText: text }),
    };

    const command = new InvokeModelCommand(input);
    const response = await this.client.send(command);
    const responseBody = await response.body.transformToString();
    return JSON.parse(responseBody);
  }

  async textToSpeech({ text, voiceId = 'Joanna' }: TtsDto) {

    const command = new SynthesizeSpeechCommand({
      OutputFormat: 'mp3',
      Text: text,
      VoiceId: voiceId as VoiceId,
    });

    const response = await this.polly.send(command);

    if (!response.AudioStream) {
      throw new Error("No audio stream returned from Polly");
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of response.AudioStream as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);

    return {
      base64Audio: audioBuffer.toString('base64'),
    };

  }
}

/*
for text generation: 
update aws credentials in environment, and prompts on prompts.txt
run this in terminal 1: npm run start:dev
run this in terminal 2: node generate-batch.mjs
*/

/*
for text embeddings: 
run this in terminal 1: npm run start:dev
run appropriate file in terminal 2
*/

/*
for text-to-speech:
run this in terminal 1: npm run start:dev
run appropriate file in terminal 2
*/
