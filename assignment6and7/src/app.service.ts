import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly apiKey: string;
  private readonly apiHost: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    console.log('Environment variables:', {
      apiKey: this.configService.get<string>('RAPIDAPI_KEY'),
      apiHost: this.configService.get<string>('RAPIDAPI_HOST'),
    });

    this.apiKey = this.configService.get<string>('RAPIDAPI_KEY');
    this.apiHost = this.configService.get<string>('RAPIDAPI_HOST');
    
    if (!this.apiKey || !this.apiHost) {
      throw new Error(`Missing required environment variables. 
        RAPIDAPI_KEY: ${!!this.apiKey}, 
        RAPIDAPI_HOST: ${!!this.apiHost}`
      );
    }
    
    this.baseUrl = `https://${this.apiHost}`;
  }

  async getJobDetails(jobId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/job-details`, {
        params: { jobId },
        headers: {
          'x-rapidapi-host': this.apiHost,
          'x-rapidapi-key': this.apiKey,
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error fetching job details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
