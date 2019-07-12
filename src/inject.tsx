import * as React from 'react';
import { Container, StateFromContainer } from './container';

type PropsFromKeys<S, K extends keyof S> = {
  [P in K]: S[P];
};

type WithoutProps<P, K> = Pick<P, Exclude<keyof P, K>>;

export const createInject = <
  C extends Container<S>,
  S extends object = StateFromContainer<C>
>(
  container: C
) => <K extends keyof S, P extends PropsFromKeys<S, K>>(...keys: K[]) => (
  Component: React.ComponentType<P>
) => (props: WithoutProps<P, K>) => {
  const values = keys.reduce(
    (keyValues, key) => ({
      ...keyValues,
      [key]: container.get(key),
    }),
    {}
  );

  return <Component {...(props as P)} {...values} />;
};
