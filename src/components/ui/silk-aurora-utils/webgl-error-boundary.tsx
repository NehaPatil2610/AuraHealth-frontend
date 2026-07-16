import React from 'react';

export class WebGLErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const WebGLFallback = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div className={className} style={style} />
);
