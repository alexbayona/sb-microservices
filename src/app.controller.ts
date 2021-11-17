import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SBClientProxyService } from './sb-client-proxy/sb-client-proxy.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sbClientProxyService: SBClientProxyService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-emit')
  testEmitAction() {
    this.sbClientProxyService.emit(
      'inttesqueue',
      'Greeting from action test-emit',
    );
    return 'ok';
  }

  @Get('test-send')
  testSendAction() {
    this.sbClientProxyService
      .send('greeting', 'Greeting from action test-emit')
      .subscribe((rs) => {
        console.log('after send', rs);
      });
    return 'ok';
  }
}
