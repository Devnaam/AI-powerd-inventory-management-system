import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-light">
        <Toaster position="top-right" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Inventory AI MVP
            </h1>
            <p className="text-text-secondary text-lg">
              Phase 1 Setup Complete ✅
            </p>
            <p className="text-text-muted mt-2">
              Backend + Frontend initialized successfully
            </p>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
