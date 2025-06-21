import { container, type DependencyContainer } from 'tsyringe';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Credentials } from '../types';

const ContainerContext = createContext<DependencyContainer>(container);

export interface ContainerProviderProps {
  credentials: Credentials;
  children: ReactNode;
}

export function ContainerProvider({ credentials, children }: ContainerProviderProps) {
  const [childContainer] = useState(() => {
    const child = container.createChildContainer();

    child.register<Credentials>('Credentials', { useValue: credentials });

    return child;
  });

  return (
    <ContainerContext.Provider value={childContainer}>
      {children}
    </ContainerContext.Provider>
  )
}

export type Constructor<T> = new (...args: any[]) => T;

export function useModel<T>(constructor: Constructor<T>): T {
  const container = useContext(ContainerContext);
  const [instance] = useState(() => container.resolve(constructor));

  return instance;
}
