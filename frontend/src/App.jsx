import { Component } from 'react';
import AppRoutes from './routes/AppRoutes';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{color: 'red', padding: '20px', background: 'white'}}>
        <h1>Something went wrong.</h1>
        <pre>{this.state.error && this.state.error.toString()}</pre>
        <pre>{this.state.error && this.state.error.stack}</pre>
      </div>;
    }

    return this.props.children; 
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default App;