import { singleton } from 'tsyringe';

const LOCAL_STORAGE_ROOK_KEY = 'andres::p2p-chat';

type Assertion<T> = (value: unknown) => asserts value is T;

@singleton()
export class StorageService {
  private getPath(key: string): string {
    return `${LOCAL_STORAGE_ROOK_KEY}/${key}`;
  }

  read<T>(key: string, assertion: Assertion<T>): T | undefined {
    const serialized = localStorage.getItem(this.getPath(key));

    if (!serialized) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(serialized);

      assertion(parsed);

      return parsed;
    } catch {
      return undefined;
    }
  }

  write<T>(key: string, value: T | undefined): void {
    if (value === undefined) {
      return localStorage.removeItem(this.getPath(key));
    }

    const serialized = JSON.stringify(value);

    localStorage.setItem(this.getPath(key), serialized);
  }
}
