import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Vehicles from '@/pages/Vehicles';
import Visitors from '@/pages/Visitors';
import Security from '@/pages/Security';
import Settings from '@/pages/Settings';
import Reports from '@/pages/Reports';
import AccessLogs from '@/pages/AccessLogs';
import VehicleEntryLogs from '@/pages/VehicleEntryLogs';
import RFIDManagement from '@/pages/RFIDManagement';
import Violations from '@/pages/Violations';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import Registration from '@/pages/Registration';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import GuardLogin from '@/pages/GuardLogin';
import GuardDashboard from '@/pages/GuardDashboard';
import EntryGuardDashboard from '@/pages/EntryGuardDashboard';
import ExitGuardDashboard from '@/pages/ExitGuardDashboard';
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
        <Route path="/rfid-management" element={<RFIDManagement />} />
        <Route path="/violations" element={<Violations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/guard-login" element={<GuardLogin />} />
        <Route path="/guard-dashboard" element={<GuardDashboard />} />
        <Route path="/entry-guard-dashboard" element={<EntryGuardDashboard />} />
        <Route path="/exit-guard-dashboard" element={<ExitGuardDashboard />} />
        <Route path="/guard/vehicle-logs" element={<GuardVehicleLogs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
