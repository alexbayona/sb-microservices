import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceBusClient } from '@azure/service-bus';

@Injectable()
export class SBClientProvider {
    @Inject(ConfigService)
    private readonly config: ConfigService;

    private client: ServiceBusClient;

    private connect() {
        const connectionString =
            process.env.SERVICEBUS_CONNECTION_STRING || '<connection string>';

        this.client = new ServiceBusClient(connectionString);

        return this.client;
    }

    getClient = () => {
        if (!this.client) {
            return this.connect();
        }
        return this.client;
    };
}
