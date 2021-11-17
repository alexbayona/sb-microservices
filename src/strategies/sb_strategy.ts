/* eslint-disable prettier/prettier */
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { ServiceBusClient } from '@azure/service-bus';

import * as dotenv from 'dotenv';
dotenv.config();

export default class AzureServiceBusServer extends Server implements CustomTransportStrategy {
    constructor(private client: ServiceBusClient) {
        super();
    }

    listen(callback: () => void) {

        this.messageHandlers.forEach(async (handler, pattern) => {
            const queueReceiver = this.client.createReceiver(pattern);

            const messages = await queueReceiver.receiveMessages(10);

            handler(messages);
        });

        callback();
    }

    async close() {
        await this.client.close();
    }
}