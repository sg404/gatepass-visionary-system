
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Vehicles from '@/pages/Vehicles';
import Visitors from '@/pages/Visitors';
import Security from '@/pages/Security';
import Settings from '@/pages/Settings';
import Reports from '@/pages/Reports';
import AccessLogs from '@/pages/AccessLogs';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/security" element={<Security />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/access-logs" element={<AccessLogs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
