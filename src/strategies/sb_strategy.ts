/* eslint-disable prettier/prettier */
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import {
  MessageHandlers,
  ProcessErrorArgs,
  ServiceBusClient,
  ServiceBusReceivedMessage,
  ServiceBusReceiver,
} from '@azure/service-bus';

import * as dotenv from 'dotenv';
dotenv.config();

export class AzureServiceBusServer
  extends Server
  implements CustomTransportStrategy
{
  constructor(private client: ServiceBusClient) {
    super();
  }

  listen(callback: () => void) {
    this.messageHandlers.forEach(async (handler, pattern) => {
      const queueReceiver = this.client.createReceiver(pattern);

      const messageHandlers: MessageHandlers = {
        processMessage: async function (
          message: ServiceBusReceivedMessage,
        ): Promise<void> {
          // This method completes the message so that it is removed from the queue.
          await queueReceiver.completeMessage(message);

          handler(message);
        },
        processError: function (args: ProcessErrorArgs): Promise<void> {
          return new Promise<void>(() => {
            // In this code, we can add a logging mechanism to save the error
            console.error(`Error processing message: ${args.error}`);
          });
        },
      };

      // This method starts the message pump.
      queueReceiver.subscribe(messageHandlers);
    });

    callback();
  }

  async close() {
    await this.client.close();
  }
}
