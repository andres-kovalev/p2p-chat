import { makeAutoObservable } from 'mobx';
import { singleton } from 'tsyringe';
import { Credentials } from '../types';
import { assertObject, assertStringField } from '../utils/assert';
import { StorageService } from './StorageService';

@singleton()
export class CredentialsService {
  credentials: Credentials | undefined = undefined;

  constructor(private storageService: StorageService) {
    this.credentials = this.storageService.read('credentials', assertCredentials);

    makeAutoObservable(this);
  }

  private store(): void {
    this.storageService.write('credentials', this.credentials);
  }

  set(credentials: Credentials | undefined) {
    this.credentials = credentials;

    this.store();
  }
}

export function assertCredentials(
  value: unknown,
  name: string = 'value'
): asserts value is Credentials {
  assertObject(value, name);

  assertStringField(value, 'login', name);
  assertStringField(value, 'hash', name);
  assertStringField(value, 'deviceName', name);
}
