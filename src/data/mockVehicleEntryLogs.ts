
import { VehicleEntryLog, VisitorEntryLog } from '@/types/vehicleEntryLogs';

// Mock data for students and faculty with UHF stickers
export const mockVehicleEntryLogs: VehicleEntryLog[] = [
  {
    fullName: 'David Natan Apruebo',
    role: 'Student',
    stickerID: 'VS2025001',
    plateNumber: 'ABC1234',
    entryTime: '2025-05-09 08:15 AM',
    exitTime: '2025-05-09 05:30 PM',
    status: 'Completed'
  },
  {
    fullName: 'Emmilry Magic Cadesim',
    role: 'Student',
    stickerID: 'VS2025002',
    plateNumber: 'DEF5678',
    entryTime: '2025-05-09 08:30 AM',
    exitTime: '2025-05-09 04:45 PM',
    status: 'Completed'
  },
  {
    fullName: 'Shekinah Gayonoche',
    role: 'Student',
    stickerID: 'VS2025003',
    plateNumber: 'GHI9012',
    entryTime: '2025-05-09 09:00 AM',
    status: 'Active'
  },
  {
    fullName: 'Aerella Lou Nicor',
    role: 'Student',
    stickerID: 'VS2025004',
    plateNumber: 'JKL3456',
    entryTime: '2025-05-09 08:45 AM',
    exitTime: '2025-05-09 03:15 PM',
    status: 'Completed'
  },
  {
    fullName: 'Christian Porras',
    role: 'Student',
    stickerID: 'VS2025005',
    plateNumber: 'MNO7890',
    entryTime: '2025-05-08 10:15 AM',
    exitTime: '2025-05-08 06:00 PM',
    status: 'Completed'
  },
  {
    fullName: 'Angielou Sujede',
    role: 'Student',
    stickerID: 'VS2025006',
    plateNumber: 'PQR1234',
    entryTime: '2025-05-09 07:50 AM',
    status: 'Active'
  },
  {
    fullName: 'Victor Jom Sorita',
    role: 'Student',
    stickerID: 'VS2025007',
    plateNumber: 'STU5678',
    entryTime: '2025-05-09 08:10 AM',
    exitTime: '2025-05-09 04:30 PM',
    status: 'Completed'
  },
  {
    fullName: 'Hannah Planco',
    role: 'Student',
    stickerID: 'VS2025008',
    plateNumber: 'VWX9012',
    entryTime: '2025-05-09 09:20 AM',
    status: 'Active'
  },
  {
    fullName: 'Reynaldo Ilangos',
    role: 'Faculty',
    stickerID: 'VS2025009',
    plateNumber: 'YZA3456',
    entryTime: '2025-05-09 07:30 AM',
    exitTime: '2025-05-09 05:00 PM',
    status: 'Completed'
  }
];

// Mock data for visitors with temporary passes
export const mockVisitorEntryLogs: VisitorEntryLog[] = [
  {
    fullName: 'Juan Dela Cruz',
    plateNumber: 'BCD7890',
    purpose: 'Meeting with Dean',
    passID: 'TP102301',
    entryTime: '2025-05-09 09:30 AM',
    exitTime: '2025-05-09 11:45 AM',
    status: 'Completed'
  },
  {
    fullName: 'Maria Santos',
    plateNumber: 'EFG1234',
    purpose: 'Delivery of Supplies',
    passID: 'TP102302',
    entryTime: '2025-05-09 10:15 AM',
    exitTime: '2025-05-09 10:45 AM',
    status: 'Completed'
  },
  {
    fullName: 'Antonio Reyes',
    plateNumber: 'HIJ5678',
    purpose: 'Parent Meeting',
    passID: 'TP102303',
    entryTime: '2025-05-09 01:30 PM',
    status: 'Active'
  },
  {
    fullName: 'Elena Magsaysay',
    plateNumber: 'KLM9012',
    purpose: 'Event Speaker',
    passID: 'TP102304',
    entryTime: '2025-05-09 02:00 PM',
    status: 'Active'
  },
  {
    fullName: 'Ramon Villar',
    plateNumber: 'NOP3456',
    purpose: 'Maintenance Work',
    passID: 'TP102305',
    entryTime: '2025-05-08 08:30 AM',
    exitTime: '2025-05-08 04:15 PM',
    status: 'Completed'
  }
];
