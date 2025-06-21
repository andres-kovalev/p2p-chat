import { singleton } from "tsyringe";
import { makeAutoObservable } from "mobx";
import { CredentialsService } from '../services/CredentialsService';
import { Theme, ThemeService } from "../services/ThemeService";
import { Credentials } from '../types';

@singleton()
export class AppModel {
  constructor(
    private readonly themeService: ThemeService,
    private readonly credentialsService: CredentialsService
  ) {
    makeAutoObservable(this);
  }

  get theme() {
    return this.themeService.theme;
  }

  setTheme(theme: Theme) {
    this.themeService.set(theme)
  }

  get isDarkTheme(): boolean {
    return this.themeService.isDark;
  }

  get credentials() {
    return this.credentialsService.credentials;
  }

  login(credentials: Credentials) {
    this.credentialsService.set(credentials);
  }

  logout() {
    this.credentialsService.set(undefined);
  }
}
