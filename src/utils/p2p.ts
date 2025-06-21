import type { JsonValue } from "trystero";

type Listener<T extends unknown[]> = (...args: T) => void;
type SubscriberFunction<T extends unknown[]> = (listener: Listener<T>) => void;

interface EventEmitter<T extends unknown[]> {
  on(listener: Listener<T>): VoidFunction;

  off(listener: Listener<T>): void;
}

function createEventEmitter<T extends unknown[]>(subscribe: SubscriberFunction<T>): EventEmitter<T> {
  const listeners = new Set<Listener<T>>;

  subscribe((...args) => [...listeners].forEach(listener => listener(...args)));

  return {
    on(listener) {
      listeners.add(listener);

      return () => this.off(listener);
    },
    off(listener) {
      listeners.delete(listener);
    }
  }
}

type PeerListenerArguments<T, M extends JsonValue = JsonValue> = [data: T, peerId: string, metadata?: M];
export type PeerListener<T, M extends JsonValue = JsonValue> = Listener<PeerListenerArguments<T, M>>;

export interface PeerEventEmitter<T, M extends JsonValue = JsonValue> {
  on(listener: PeerListener<T, M>, peerId?: string): VoidFunction;

  off(listener: PeerListener<T, M>, peerId?: string): void;
}

export function createPeerEventEmitter<T, M extends JsonValue = JsonValue>(subscribe: SubscriberFunction<PeerListenerArguments<T, M>>): PeerEventEmitter<T, M> {
  const map: Record<string, Set<PeerListener<T, M>>> = {};

  createEventEmitter(subscribe).on((data, peerId, metadata) => {
    const peerListeners = map[peerId];
    const globalListeners = map[''];

    const listeners = (peerListeners ? [...peerListeners] : []).concat(
      globalListeners ? [...globalListeners] : []
    )

    listeners.forEach(listener => listener(data, peerId, metadata));
  });

  return {
    on(listener, peerId) {
      const id = peerId || '';

      if (id in map) {
        map[id].add(listener);
      } else {
        map[id] = new Set([listener]);
      }

      return () => this.off(listener, peerId);
    },
    off(listener, peerId) {
      const id = peerId || '';

      map[id]?.delete(listener);
    }
  }
}
