import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export function useIsMobile(): boolean {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down('md'));
}
