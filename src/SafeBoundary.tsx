import { Component, type ReactNode } from 'react';

/** Si la 3D plante (WebGL, police…), on la retire sans emporter la page. */
export class SafeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
