import { EventBusService } from 'domain/event-bus';
import { event$ } from './interceptors';

type MockEventBus = Pick<EventBusService, 'event$'>;

export function createMockEventBus(): MockEventBus {
    return {
        event$
    };
}