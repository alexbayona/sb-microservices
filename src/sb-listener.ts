/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class SBListener {
  @MessagePattern('inttesqueue')
  firstEventHandler(@Payload() data: any) {
    console.log('we got it', data);
  }
}
