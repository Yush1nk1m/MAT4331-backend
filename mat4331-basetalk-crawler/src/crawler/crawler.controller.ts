import { Controller, Get, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Controller('crawler')
export class CrawlerController {
  private readonly logger = new Logger(CrawlerController.name);

  @Get()
  async test(): Promise<void> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.naver.com');

    const data = await page.evaluate(() => {
      const anyElement = document.querySelector('a');
      return anyElement ? anyElement.href : 'No a tag found';
    });

    this.logger.verbose(`data: ${data}`);
  }
}
