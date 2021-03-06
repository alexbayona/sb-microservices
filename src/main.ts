import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AzureServiceBusServer } from 'src/strategies';
import { AppModule } from './app.module';

import { SBClientProvider } from './sb-client-proxy/sb-client.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sbClientProvider = app.get<SBClientProvider>(SBClientProvider);

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new AzureServiceBusServer(sbClientProvider.getClient()),
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
