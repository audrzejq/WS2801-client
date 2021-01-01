import {io as SocketIoClient, Socket} from 'socket.io-client';

import {generateId} from './utils';

import {Events, SocketListener} from './types/index';

export class SocketClient {
  private client: Socket;

  private listeners: {[id: string]: SocketListener} = {};

  constructor(url: string) {
    this.client = SocketIoClient(url);
  }

  public onLedStripChanged(callback: Function): string {
    const id: string = generateId(10);

    this.listeners[id] = {
      callback: callback,
      event: Events.ledStripChanged,
    };

    this.client.on(Events.ledStripChanged, callback);

    return id;
  }

  public onBrightnessChanged(callback: Function): string {
    const id: string = generateId(10);

    this.listeners[id] = {
      callback: callback,
      event: Events.brightnessChanged,
    };

    this.client.on(Events.brightnessChanged, callback);

    return id;
  }

  public removeListener(id: string): void {
    const listener: SocketListener = this.listeners[id];

    if (listener === undefined) {
      return;
    }

    delete listener[id];

    this.client.off(listener.event, listener.callback);
  }

  public dispose(): void {
    this.client.disconnect();
  }
}
