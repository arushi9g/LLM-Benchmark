"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BedrockController = void 0;
const common_1 = require("@nestjs/common");
const bedrock_service_1 = require("./bedrock.service");
const embed_text_dto_1 = require("./dto/embed-text.dto");
const tts_dto_1 = require("./dto/tts.dto");
let BedrockController = class BedrockController {
    constructor(bedrockService) {
        this.bedrockService = bedrockService;
    }
    async generate(prompt) {
        return this.bedrockService.generateText(prompt);
    }
    embedText(body) {
        return this.bedrockService.embedText(body);
    }
    async textToSpeech(body) {
        return this.bedrockService.textToSpeech(body);
    }
};
exports.BedrockController = BedrockController;
__decorate([
    (0, common_1.Get)('generate'),
    __param(0, (0, common_1.Query)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BedrockController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('embed'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [embed_text_dto_1.EmbedTextDto]),
    __metadata("design:returntype", void 0)
], BedrockController.prototype, "embedText", null);
__decorate([
    (0, common_1.Post)('tts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tts_dto_1.TtsDto]),
    __metadata("design:returntype", Promise)
], BedrockController.prototype, "textToSpeech", null);
exports.BedrockController = BedrockController = __decorate([
    (0, common_1.Controller)('bedrock'),
    __metadata("design:paramtypes", [bedrock_service_1.BedrockService])
], BedrockController);
