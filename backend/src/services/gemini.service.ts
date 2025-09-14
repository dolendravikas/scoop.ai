import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    
    if (!apiKey) {
      throw new HttpException('Google API key not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyze(data: any[], query: string): Promise<string> {
    try {
      console.log('Analyzing with Gemini:', { dataCount: data.length, query });
      
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Analyze the following social media data and provide insights about "${query}":\n\n${JSON.stringify(data, null, 2)}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Gemini Error:', error.message);
      
      // Try with different model names
      try {
        const model2 = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await model2.generateContent(prompt);
        const response2 = await result2.response;
        return response2.text();
      } catch (error2) {
        console.error('Gemini Error 2:', error2.message);
        throw new HttpException('Error processing with Gemini: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
