import { createContext, type ReactNode, useContext, useEffect, useId } from 'react';
import { expectNever } from '../utils/expect';

const DepthContext = createContext<number>(0);

interface ColorEntry {
  color: string;
  depth: number;
}

interface ProviderState {
  initialColor?: string | null;
  entries: Map<string, ColorEntry>;
  status: 'idle' | 'scheduled';
}

const state: ProviderState = {
  entries: new Map<string, ColorEntry>(),
  status: 'idle',
};

function updateColor(): void {
  if (!state.entries.size) {
    if (state.initialColor !== undefined) {
      setColor(state.initialColor);
      state.initialColor = undefined;
    }

    return;
  }

  let current: ColorEntry | null = null;

  for (const [, entry] of state.entries) {
    if (!current || entry.depth > current.depth) {
      current = entry;
    }
  }

  state.status = 'idle';

  if (!current) return;

  if (state.initialColor === undefined) {
    state.initialColor = getColor();
  }

  setColor(current.color);
}

function scheduleUpdate(): void {
  switch (state.status) {
    case 'idle':
      queueMicrotask(updateColor);

      state.status = 'scheduled';

      return;

    case 'scheduled':
      return;

    default:
      return expectNever(state.status);
  }
}

export interface PWABackgroundColorProps {
  color: string;
  children: ReactNode;
}

export function PWABackgroundColor({ color, children }: PWABackgroundColorProps) {
  const id = useId();
  const depth = useContext(DepthContext);

  useEffect(() => {
    state.entries.set(id, { color, depth });

    scheduleUpdate();

    return () => {
      state.entries.delete(id);

      scheduleUpdate();
    };
  }, [id, color, depth]);

  return <DepthContext.Provider value={depth + 1}>{children}</DepthContext.Provider>;
}

function getColor(): string | null {
  return findColorMeta()?.getAttribute('content') ?? null;
}

function setColor(color: string | null) {
  if (color === null) {
    findColorMeta()?.remove();
  } else {
    getColorMeta().setAttribute('content', color);
  }
}

function getColorMeta(): HTMLMetaElement {
  return findColorMeta() ?? createColorMeta();
}

function findColorMeta(): HTMLMetaElement | null {
  return document.head.querySelector('meta[name="theme-color"]');
}

function createColorMeta(): HTMLMetaElement {
  const meta = document.createElement('meta') as HTMLMetaElement;

  meta.setAttribute('name', 'theme-color');

  document.head.appendChild(meta);

  return meta;
}