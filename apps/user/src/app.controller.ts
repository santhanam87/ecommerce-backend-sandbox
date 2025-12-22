import { Controller, Get, Headers, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('products')
  public async getUsersWithProducts(
    @Headers('authorization') authorization: string,
  ): Promise<{ data: any[] }> {
    const url = 'http://localhost:3001/products';
    const headers = {
      Authorization: authorization,
      'Content-Type': 'application/json',
    };
    try {
      const productResponse = this.httpService.get(url, { headers });
      const productsReponse = await lastValueFrom(productResponse);
      return productsReponse.data;
    } catch (error) {
      throw new HttpException(
        {
          status: error.response?.status || 500,
          error: 'Error fetching products',
        },
        (error.response?.status as number) || 500,
      );
    }
  }
}
