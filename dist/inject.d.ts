import * as React from 'react';
declare type PropsFromKeys<S, K extends keyof S> = {
    [P in K]: S[P];
};
export declare const createInject: <T extends object>() => <K extends keyof T>(...keys: K[]) => <P extends PropsFromKeys<T, K>>(Component: React.ComponentType<P>) => (props: Pick<P, Exclude<keyof P, K>>) => JSX.Element;
export {};
