import { Router } from '@solidjs/router';
import type { Component } from 'solid-js';
import { routes } from './router';

const App: Component = () => {
  return <Router>{routes}</Router>;
};

export default App;
