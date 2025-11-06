import { Module } from '@nestjs/common';
import { InventoryEventHandler } from './inventory-event.handler';
import { CreateItemUseCase } from '../../application/use-cases/create-item.usecase';

@Module({
  providers: [InventoryEventHandler, CreateItemUseCase],
})
export class EventsModule {}
