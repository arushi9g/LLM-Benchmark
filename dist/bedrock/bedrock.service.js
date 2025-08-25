"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedrockService = void 0;
const common_1 = require("@nestjs/common");
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const client_polly_1 = require("@aws-sdk/client-polly");
const credential_provider_ini_1 = require("@aws-sdk/credential-provider-ini");
let BedrockService = class BedrockService {
    constructor() {
        this.client = new client_bedrock_runtime_1.BedrockRuntimeClient({
            region: "us-east-2",
            credentials: (0, credential_provider_ini_1.fromIni)({ profile: "277707123286_PowerUserAccess" })
        });
        this.polly = new client_polly_1.PollyClient({
            region: "us-east-2",
            credentials: (0, credential_provider_ini_1.fromIni)({ profile: "277707123286_PowerUserAccess" })
        });
    }
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
      async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.anthropic.claude-3-haiku-20240307-v1:0') { // ← Use ARN
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
      async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0') { // ← Use ARN
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
      async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.amazon.nova-lite-v1:0') { // ← Use ARN
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
    async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.amazon.nova-micro-v1:0') { // ← Use ARN
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
    async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.amazon.nova-premier-v1:0') { // ← Use ARN
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
    async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.amazon.nova-pro-v1:0') { // ← Use ARN
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
    async generateText(prompt, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.mistral.pixtral-large-2502-v1:0') {
        const body = JSON.stringify({
            messages: [{
                    role: "user",
                    content: [{ type: "text", text: prompt }]
                }]
        });
        const command = new client_bedrock_runtime_1.InvokeModelCommand({
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
      async generateText(prompt: string, modelId = 'arn:aws:bedrock:us-east-2:277707123286:inference-profile/us.anthropic.claude-3-7-sonnet-20250219-v1:0') { // ← Use ARN
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
    async embedText({ text }) {
        const input = {
            modelId: 'amazon.titan-embed-text-v2:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({ inputText: text }),
        };
        const command = new client_bedrock_runtime_1.InvokeModelCommand(input);
        const response = await this.client.send(command);
        const responseBody = await response.body.transformToString();
        return JSON.parse(responseBody);
    }
    // edit this part with model voices from polly
    async textToSpeech({ text, voiceId = 'Joanna' }) {
        var _a, e_1, _b, _c;
        const command = new client_polly_1.SynthesizeSpeechCommand({
            OutputFormat: 'mp3',
            Text: text,
            VoiceId: voiceId,
        });
        const response = await this.polly.send(command);
        if (!response.AudioStream) {
            throw new Error("No audio stream returned from Polly");
        }
        // Saving to disk
        const chunks = [];
        try {
            for (var _d = true, _e = __asyncValues(response.AudioStream), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                chunks.push(chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const audioBuffer = Buffer.concat(chunks);
        return {
            base64Audio: audioBuffer.toString('base64'),
        };
    }
};
exports.BedrockService = BedrockService;
exports.BedrockService = BedrockService = __decorate([
    (0, common_1.Injectable)()
], BedrockService);
/*
for text generation:
run this in terminal: npx ts-node src/main.ts
copy paste example prompt in browser: http://localhost:3000/bedrock/generate?prompt=Explain%20black%20holes%20like%20I'm%205
*/
/*
for text embeddings:
run this in terminal: npm run start:dev

node generate-batch.mjs

then new terminal enter this example:
curl -X POST http://localhost:3000/bedrock/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world, embed this text"}'
*/
/*
for text-to-speech:
run this in terminal: npm run start:dev
then new terminal enter this example:
curl -X POST http://localhost:3000/bedrock/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello 6% change of sales for you Mr. Iyer, this is your Amazon Polly voice!", "voiceId": "Joanna"}'

*/
