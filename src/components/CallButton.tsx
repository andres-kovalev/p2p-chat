import { type JSX, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material';

type ButtonVariant = 'active' | 'error' | 'default';

const buttonVariantColorMap: Record<ButtonVariant, [string, string]> = {
  active: [ '#2196f3', '#1976d2' ],
  error: [ '#f44336', '#d32f2f' ],
  default: [ 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.3)' ],
}

interface ControlButtonProps {
  variant?: ButtonVariant;
  buttonSize?: number;
  children?: ReactNode;
}

const ControlButton = styled(IconButton)<ControlButtonProps>(({ variant = 'default', buttonSize = 56 }) => {
  const [ backgroundColor, backgroundColorHovered ] = buttonVariantColorMap[variant];

  return {
    width: buttonSize,
    height: buttonSize,
    backgroundColor,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: backgroundColorHovered,
    },
  };
});

const ButtonWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
});

const ButtonLabel = styled(Typography)({
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 500,
  textAlign: 'center',
  userSelect: 'none',
});

interface CallButtonProps extends Omit<ControlButtonProps, 'buttonSize'> {
  label?: string;
  size?: number;
  disabled?: boolean;
  onClick: VoidFunction;
}

export const CallButton = ({ label, size, ...restProps }: CallButtonProps): JSX.Element => {
  const button = <ControlButton {...restProps} buttonSize={size} />;

  if (!label) return button;

  return (
    <ButtonWrapper>
      {button}
      <ButtonLabel>{label}</ButtonLabel>
    </ButtonWrapper>
  );
}