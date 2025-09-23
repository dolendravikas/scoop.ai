import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

    if (!apiKey) {
      console.warn(
        'Google API key not configured - Gemini service will not be available',
      );
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async analyze(
    data: any[],
    query: string,
    model: string = 'gemini-1.5-flash',
    customPrompt?: string,
  ): Promise<string> {
    if (!this.genAI) {
      throw new HttpException(
        'Google API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      console.log(
        `Gemini API: Analyzing ${data.length} items with model ${model}`,
      );

      const modelInstance = this.genAI.getGenerativeModel({ model });

      const prompt =
        customPrompt ||
        `Analyze the following social media data and provide insights about "${query}":\n\n${JSON.stringify(data, null, 2)}`;

      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;

      return response.text();
    } catch (error) {
      console.error('Gemini Analysis Error:', error.message);

      // Try with different model names as fallback
      try {
        console.log('Trying fallback model: gemini-pro');
        const fallbackModel = this.genAI!.getGenerativeModel({
          model: 'gemini-pro',
        });
        const prompt =
          customPrompt ||
          `Analyze the following social media data and provide insights about "${query}":\n\n${JSON.stringify(data, null, 2)}`;
        const result = await fallbackModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error2) {
        console.error('Gemini Fallback Error:', error2.message);
        throw new HttpException(
          `Error processing with Gemini: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async generateContent(
    prompt: string,
    model: string = 'gemini-1.5-flash',
    maxTokens: number = 1000,
  ): Promise<string> {
    if (!this.genAI) {
      throw new HttpException(
        'Google API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      console.log(`Gemini API: Generating content with model ${model}`);

      const modelInstance = this.genAI.getGenerativeModel({
        model,
        generationConfig: {
          maxOutputTokens: maxTokens,
        },
      });

      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;

      return response.text();
    } catch (error) {
      console.error('Gemini Generation Error:', error.message);

      // Try with different model names as fallback
      try {
        console.log('Trying fallback model: gemini-pro');
        const fallbackModel = this.genAI!.getGenerativeModel({
          model: 'gemini-pro',
          generationConfig: {
            maxOutputTokens: maxTokens,
          },
        });
        const result = await fallbackModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error2) {
        console.error('Gemini Fallback Error:', error2.message);
        throw new HttpException(
          `Error generating content with Gemini: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async summarizeText(text: string, maxLength: number = 500): Promise<string> {
    try {
      const prompt = `Please summarize the following text in no more than ${maxLength} characters:\n\n${text}`;
      return await this.generateContent(prompt, 'gemini-1.5-flash', maxLength);
    } catch (error) {
      console.error('Gemini Summarization Error:', error.message);
      throw new HttpException(
        `Error summarizing text: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async extractKeywords(text: string, count: number = 10): Promise<string[]> {
    try {
      const prompt = `Extract the top ${count} most important keywords from the following text. Return them as a comma-separated list:\n\n${text}`;
      const result = await this.generateContent(
        prompt,
        'gemini-1.5-flash',
        200,
      );
      return result
        .split(',')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);
    } catch (error) {
      console.error('Gemini Keyword Extraction Error:', error.message);
      throw new HttpException(
        `Error extracting keywords: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
