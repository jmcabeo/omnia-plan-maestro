import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ConfigWizard from './pages/ConfigWizard';
import PlanIA from './pages/PlanIA'; // We can adapt this later or keep it as the generator
import StrategyView from './pages/StrategyView';
import DatasetBuilder from './pages/DatasetBuilder';

import DataUpload from './pages/DataUpload';

// Temporary placeholder for Generator and Results until created
// Temporary placeholder used for RealResults below
const RealResults = () => <div className="p-8 text-center text-xl font-bold text-slate-500">Registro de Resultados Reales (En construcción)</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Omnia 3.0 v0.1 */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/config" element={<ConfigWizard />} />
          <Route path="/upload" element={<DataUpload />} />
          <Route path="/generator" element={<PlanIA />} /> {/* Reusing PlanIA for now as generator */}
          <Route path="/strategy" element={<StrategyView />} />
          <Route path="/results" element={<RealResults />} />
          <Route path="/dataset" element={<DatasetBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
