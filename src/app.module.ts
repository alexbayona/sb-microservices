import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SBClientProxyService } from './sb-client-proxy/sb-client-proxy.service';
import { SBClientProvider } from './sb-client-proxy/sb-client.provider';
import { SBListener } from './sb-listener';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, SBListener],
  providers: [AppService, SBClientProvider, SBClientProxyService],
})
export class AppModule {}
