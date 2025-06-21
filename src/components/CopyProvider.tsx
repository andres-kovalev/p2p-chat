import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useIsMobile } from '../hooks/useIsMobile';

type CopyFunction = (text: string) => void;

const CopyContext = createContext<CopyFunction>(() => {});

export interface CopyProviderProps {
  children: ReactNode;
}

type CopyState = 'hidden' | 'success' | 'error';

export function CopyProvider({ children }: CopyProviderProps) {
  const isMobile = useIsMobile();

  const [copyState, setCopyState] = useState<CopyState>('hidden');

  const copy = useCallback((text: string) => {
    copyTextToClipboard(text).then(
      () => setCopyState('success'),
      () => setCopyState('error')
    )
  }, []);

  const hide = () => setCopyState('hidden');

  return (
    <CopyContext value={copy}>
      {children}

      <Snackbar
        open={copyState !== 'hidden'}
        autoHideDuration={3000}
        anchorOrigin={{
          horizontal: 'center',
          vertical: isMobile ? 'bottom' : 'top',
        }}
        onClose={hide}
        onClick={hide}
        message={copyState === 'success'
          ? 'Copied to clipboard'
          : 'Copy to clipboard failed'}
      />
    </CopyContext>
  )
}

export const useCopyToClipboard = () => useContext(CopyContext);

function copyTextToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    copyTextToClipboardFallback(text);
    return Promise.resolve();
  }

  return navigator.clipboard.writeText(text);
}

function copyTextToClipboardFallback(text: string): void {
  const tmp = document.createElement('input');
  const focus = document.activeElement as HTMLElement;

  tmp.value = text;

  document.body.appendChild(tmp);
  tmp.select();

  document.execCommand('copy');

  document.body.removeChild(tmp);
  focus.focus();
}
