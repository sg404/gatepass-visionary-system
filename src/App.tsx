
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Vehicles from '@/pages/Vehicles';
import Visitors from '@/pages/Visitors';
import Security from '@/pages/Security';
import Settings from '@/pages/Settings';
import Reports from '@/pages/Reports';
import AccessLogs from '@/pages/AccessLogs';
import VehicleEntryLogs from '@/pages/VehicleEntryLogs';
import NotFound from '@/pages/NotFound';
import GuardLogin from '@/pages/GuardLogin';
import GuardDashboard from '@/pages/GuardDashboard';
import GuardVehicleLogs from '@/pages/GuardVehicleLogs';

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
        <Route path="/vehicle-entry-logs" element={<VehicleEntryLogs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/guard-login" element={<GuardLogin />} />
        <Route path="/guard-dashboard" element={<GuardDashboard />} />
        <Route path="/guard/vehicle-logs" element={<GuardVehicleLogs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
