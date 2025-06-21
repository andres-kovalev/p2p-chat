import { makeAutoObservable } from 'mobx';
import { singleton } from 'tsyringe';
import { assertUnion } from '../utils/assert';
import { StorageService } from './StorageService';

const themes = ['system', 'light', 'dark'] as const;

export type Theme = (typeof themes)[number];

@singleton()
export class ThemeService {
  #mediaMatch = matchMedia('(prefers-color-scheme: dark)');

  public theme: Theme = 'system';

  public isDark: boolean = this.#mediaMatch.matches;

  constructor(private storageService: StorageService) {
    this.set(
      this.storageService.read(
        'theme',
        value => assertUnion(value, themes)
      ) ?? 'system'
    );

    makeAutoObservable(this);
  }

  private store(): void {
    this.storageService.write('theme', this.theme);
  }

  set(theme: Theme) {
    if (theme === this.theme) return;

    if (theme === 'system') {
      this.isDark = this.#mediaMatch.matches;
      this.#mediaMatch.addEventListener('change', this.handleSystemModeChange);
    }

    if (this.theme === 'system') {
      this.isDark = theme === 'dark';
      this.#mediaMatch.removeEventListener('change', this.handleSystemModeChange);
    }

    this.theme = theme;

    this.store();
  }

  private readonly handleSystemModeChange = ({ matches }: MediaQueryListEvent) => {
    if (this.theme === 'system') {
      this.isDark = matches;
    } else {
      console.warn(`There shouldn't be a theme listener registered!`);
    }
  }
}
