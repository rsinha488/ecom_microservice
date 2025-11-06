import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

@Injectable()
export class EventBusService {
  private emitter = new EventEmitter();
  private logger = new Logger('EventBus');

  emit(event: string, payload: any) {
    this.logger.debug(`emit ${event}`);
    this.emitter.emit(event, payload);
    return Promise.resolve();
  }

  on(event: string, cb: (payload: any) => void) {
    this.emitter.on(event, cb);
  }

  once(event: string, cb: (payload: any) => void) {
    this.emitter.once(event, cb);
  }
}
