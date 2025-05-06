import { Typography, Alert } from '@mui/material';
import React from 'react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChartErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Chart Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          <Typography>Chart failed to load</Typography>
          {this.state.error && (
            <Typography variant="caption">
              {this.state.error.message}
            </Typography>
          )}
        </Alert>
      );
    }
    return this.props.children;
  }
}