import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SBClientProxyService, SBClientProvider } from './sb-client-proxy';
import { SBListener } from './sb-listener';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, SBListener],
  providers: [AppService, SBClientProvider, SBClientProxyService],
})
export class AppModule {}
