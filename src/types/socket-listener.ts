import {Events} from './index';

export type SocketListener = {
  event: Events,
  callback: Function,
};
