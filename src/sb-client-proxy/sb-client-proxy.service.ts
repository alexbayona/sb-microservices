/* eslint-disable prettier/prettier */
import { ServiceBusMessage } from '@azure/service-bus';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';

import { SBClientProvider } from './sb-client.provider';

@Injectable()
export class SBClientProxyService extends ClientProxy {
    @Inject(SBClientProvider)
    private client: SBClientProvider;

    async connect(): Promise<any> {
        this.client.getClient();
        console.log('connect client proxy');
    }

    async close() {
        this.client.getClient().close();
    }

    /* this method is used when you call SBClientProxyService.emmit*/
    async dispatchEvent(packet: ReadPacket<any>): Promise<any> {

        console.log("packet: ", packet);

        const sender = this.client.getClient().createSender(packet.pattern);

        const data: ServiceBusMessage[] = [{ body: packet.data }];

        try {
            await sender.sendMessages(data);
            console.log(`Done sending, closing...`);
            await sender.close();
        } finally {
            await this.close();
        }

        return;
    }

    /**
     * this method will be called when use SBClientProxyService.send
     * can be use to implement request-response
     */
    publish(
        packet: ReadPacket<any>,
        callback: (packet: WritePacket<any>) => void,
    ) {
        console.log('message:', packet);

        // In a real-world application, the "callback" function should be executed
        // with payload sent back from the responder. Here, we'll simply simulate (5 seconds delay)
        // that response came through by passing the same "data" as we've originally passed in.
        setTimeout(() => callback({ response: packet.data }), 5000);

        return () => console.log('teardown');
    }
}
