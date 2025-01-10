import { Controller, Get, Query, HttpException, HttpStatus, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHome() {
    return {
      title: 'Twitter Job Search',
      description: 'Search for job details from Twitter'
    };
  }

  @Get('search')
  @Render('search')
  async searchJob(
    @Query('jobId') jobId: string,
  ) {
    if (!jobId) {
      return {
        title: 'Search Jobs',
        error: null,
        job: null
      };
    }

    try {
      const jobDetails = await this.appService.getJobDetails(jobId);
      return {
        title: 'Job Details',
        error: null,
        job: jobDetails
      };
    } catch (error) {
      return {
        title: 'Job Details',
        error: error.message,
        job: null
      };
    }
  }

  // Keep the API endpoint for programmatic access
  @Get('api/jobs/details')
  async getJobDetails(
    @Query('jobId') jobId: string,
  ) {
    if (!jobId) {
      throw new HttpException('Job ID parameter is required', HttpStatus.BAD_REQUEST);
    }
    return this.appService.getJobDetails(jobId);
  }
}
