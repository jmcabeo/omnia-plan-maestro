import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ConfigWizard from './pages/ConfigWizard';
import PlanIA from './pages/PlanIA'; // We can adapt this later or keep it as the generator
import StrategyView from './pages/StrategyView';
import DatasetBuilder from './pages/DatasetBuilder';

import DataUpload from './pages/DataUpload';

import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// Temporary placeholder for Generator and Results until created
// Temporary placeholder used for RealResults below
const RealResults = () => <div className="p-8 text-center text-xl font-bold text-slate-500">Registro de Resultados Reales (En construcción)</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Omnia 3.0 v0.1 */}
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/config" element={
            <ProtectedRoute>
              <ConfigWizard />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <DataUpload />
            </ProtectedRoute>
          } />
          <Route path="/generator" element={
            <ProtectedRoute>
              <PlanIA />
            </ProtectedRoute>
          } />
          <Route path="/strategy" element={
            <ProtectedRoute>
              <StrategyView />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <RealResults />
            </ProtectedRoute>
          } />
          <Route path="/dataset" element={
            <ProtectedRoute>
              <DatasetBuilder />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
