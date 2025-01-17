<p align="center" style="margin: 80px 0">
  <img src="./assets/logo.svg" width="400px" height="115px" alt="recontainer" />
</p>

<h3 align="center" color="#24292e">
  Light and simple dependency injection for TypeScript and JavaScript React applications.
</h3>

<br>

![gzip size](https://img.shields.io/badge/gzipped-914B-green.svg)


### Why?

In most cases, ES6 modules are efficient way to share dependencies throughout application. 

There are some situations though, where you need a single point of configuration to achieve better decoupling between multiple components. One of these cases is server-side rendering, in which you might want to change implementation that depends on browser APIs to something more suitable for a Node.js application.

Moreover, using global instances imported as ES6 module can lead to memory-leaks and bugs on server-side. Take for example a global instance of event publisher, to which application subscribes on each request. Since it is not disposed after each request, any failure to unsubscribe will cause a linear leak of memory.

### Why not Redux?

Redux is great at distributing state throughout application and decoupling your React components. Although you could share almost any object via store, it is generally a good practice to keep the state serializable. Many redux-related libraries (eg. [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper)) will not work if the state couldn't be serialized.

Functions and object instances (eg. `Promise`) are not serializable, thus we should keep them elsewhere.

### Features

* 100% Type-safe
  > When used with **TypeScript**, recontainer protects you from type errors and allows you to extract the full potential of your editor's code completion features
* Light-weight
  > Total module size is 914 bytes gzipped
* Simple


## Examples

<details>
<summary>TypeScript</summary>

<br>

> types.ts
```typescript
export interface User {
  id: string;
  name: string;
}
```

<br>

> container.ts
```typescript
import { createInject, ContainerConfig } from 'recontainer';
import { User } from './types';

export interface Dependencies {
  user: User;
  greeting: string;
  greetingProvider: (user: User) => string;
}

const user = {
  id: 'john-doe',
  name: 'John Doe',
};

export const config: ContainerConfig<Dependencies> = {
  user: () => user,
  greetingProvider: () => (user: User) => `Hello ${user.name}!`,
  greeting: container => {
    const greetingProvider = container.get('greetingProvider');
    const user = container.get('user');

    return greetingProvider(user);
  },
};

export const inject = createInject<Dependencies>(); // createInject function creates type-aware `inject` higher order component
```

<br>

> Greeter.tsx
<details open>
<summary>Using <b>inject</b></summary>

```tsx
import * as React from 'react';
import { inject } from './container';

interface GreeterProps {
  greeting: string;
  user: User;
}

const Greeter: React.FunctionComponent<GreeterProps> = ({
  user,
  greeting,
}) => (
  <div>
    <h1>{greeting}</h1>
    ID: {user.id}
  </div>
);

export default inject('greeting', 'user')(Greeter);
```
</details>

<details>
<summary>Using <b>withContainer</b></summary>

```tsx
import * as React from 'react';
import { withContainer, ContainerProps } from 'recontainer';
import { Dependencies } from './container';

interface GreeterProps extends ContainerProps<Dependencies> {
  
}

const Greeter: React.FunctionComponent<GreeterProps> = ({
  container
}) => (
  <div>
    <h1>{container.get('greeting')}</h1>
    ID: {container.get('user').id}
  </div>
);

export default withContainer(Greeter);
```
</details>

<br>

> App.tsx
```tsx
import * as React from 'react';
import { createContainer } from 'recontainer';
import { config } from './container';
import Greeter from './Greeter';

const container = createContainer(config);

export const App: React.FunctionComponent = () => (
  <ContainerProvider container={container}>
    <Greeter />
    {/* 
        <div>
          <h1>Hello John Doe!</h1>
          ID: john-doe
        </div>
    */}
  </ContainerProvider>
);
```
</details>



<details>
<summary>JavaScript</summary>

<br>

> container.js
```javascript
import { createInject } from 'recontainer';

const user = {
  id: 'john-doe',
  name: 'John Doe',
};

export const config = {
  user: () => user,
  greetingProvider: () => user => `Hello ${user.name}!`,
  greeting: container => {
    const greetingProvider = container.get('greetingProvider');
    const user = container.get('user');

    return greetingProvider(user);
  },
};

export const inject = createInject(); // createInject function creates `inject` higher order component
```

<br>

> Greeter.jsx
<details open>
<summary>Using <b>inject</b></summary>

```jsx
import React from 'react';
import { inject } from './container';

const Greeter = ({
  user,
  greeting,
}) => (
  <div>
    <h1>{greeting}</h1>
    ID: {user.id}
  </div>
);

export default inject('greeting', 'user')(Greeter);
```
</details>

<details>
<summary>Using <b>withContainer</b></summary>

```jsx
import React from 'react';
import { withContainer } from 'recontainer';

const Greeter = ({
  container
}) => (
  <div>
    <h1>{container.get('greeting')}</h1>
    ID: {container.get('user').id}
  </div>
);

export default withContainer(Greeter);
```
</details>

<br>

> App.jsx
```jsx
import React from 'react';
import { createContainer } from 'recontainer';
import { config } from './container';
import Greeter from './Greeter';

const container = createContainer(config);

export const App = () => (
  <ContainerProvider container={container}>
    <Greeter />
    {/* 
        <div>
          <h1>Hello John Doe!</h1>
          ID: john-doe
        </div>
    */}
  </ContainerProvider>
);
```
</details>

## Installation

With yarn
```sh
$ yarn add recontainer
```

With npm
```sh
$ npm install recontainer
```

*Please note that types are included, thus there is no need to install @types/recontainer package*

### Requirements

* [React](https://github.com/facebook/react/) ^16.8.6
* *optional* [TypeScript](https://github.com/microsoft/TypeScript) ^3.5.2

### Docs

#### Container methods
##### get

  ```javascript
   const container = createContainer({
     logger: () => message => console.log(message),
   });

   const log = container.get('logger');

   log('Hello World!'); // Console output: Hello World!
  ```
##### getAll
  ```javascript
   const container = createContainer({
     logger: () => message => console.log(message),
     message: () => 'Foo bar',
   });

   const { logger, message } = container.getAll();

   logger(message); // Console output: Foo bar
  ```
