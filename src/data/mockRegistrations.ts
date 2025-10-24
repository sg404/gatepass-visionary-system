// Mock data for vehicle registrations
export interface RegistrationApplication {
  id: string;
  fullName: string;
  role: 'student' | 'faculty' | 'non-teaching';
  email: string;
  contact: string;
  course?: string;
  year?: string;
  section?: string;
  employmentType?: string;
  vehicleType: string;
  manufacturer: string;
  model: string;
  color: string;
  plateNumber: string;
  fuelType: string;
  cubicCapacity?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  registrationCode?: string;
  rejectionReason?: string;
  documents: {
    driverLicense: string; // URL or base64
    officialReceipt: string;
    certificateOfRegistration: string;
  };
}

export const mockRegistrations: RegistrationApplication[] = [
  {
    id: '1',
    fullName: 'Juan Dela Cruz',
    role: 'student',
    email: 'juan.delacruz@ssedmmo.edu.ph',
    contact: '+63 912 345 6789',
    course: 'Computer Science',
    year: '3',
    section: 'A',
    vehicleType: 'motorcycle',
    manufacturer: 'Honda',
    model: 'Click 125i',
    color: 'Red',
    plateNumber: 'ABC 123',
    fuelType: 'gasoline',
    cubicCapacity: '125',
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z',
    documents: {
      driverLicense: '/placeholder.svg',
      officialReceipt: '/placeholder.svg',
      certificateOfRegistration: '/placeholder.svg'
    }
  },
  {
    id: '2',
    fullName: 'Maria Santos',
    role: 'faculty',
    email: 'maria.santos@ssedmmo.edu.ph',
    contact: '+63 917 654 3210',
    employmentType: 'full-time',
    vehicleType: 'car',
    manufacturer: 'Toyota',
    model: 'Vios',
    color: 'White',
    plateNumber: 'XYZ 789',
    fuelType: 'gasoline',
    status: 'approved',
    submittedAt: '2024-01-10T14:20:00Z',
    registrationCode: 'REG-1704892800000',
    documents: {
      driverLicense: '/placeholder.svg',
      officialReceipt: '/placeholder.svg',
      certificateOfRegistration: '/placeholder.svg'
    }
  },
  {
    id: '3',
    fullName: 'Pedro Reyes',
    role: 'non-teaching',
    email: 'pedro.reyes@ssedmmo.edu.ph',
    contact: '+63 918 987 6543',
    employmentType: 'maintenance',
    vehicleType: 'truck',
    manufacturer: 'Ford',
    model: 'Ranger',
    color: 'Blue',
    plateNumber: 'DEF 456',
    fuelType: 'diesel',
    status: 'rejected',
    submittedAt: '2024-01-12T09:15:00Z',
    rejectionReason: 'Incomplete documentation - missing Certificate of Registration',
    documents: {
      driverLicense: '/placeholder.svg',
      officialReceipt: '/placeholder.svg',
      certificateOfRegistration: '/placeholder.svg'
    }
  },
  {
    id: '4',
    fullName: 'Ana Garcia',
    role: 'student',
    email: 'ana.garcia@ssedmmo.edu.ph',
    contact: '+63 919 111 2222',
    course: 'Information Technology',
    year: '2',
    section: 'B',
    vehicleType: 'motorcycle',
    manufacturer: 'Yamaha',
    model: 'NMAX',
    color: 'Black',
    plateNumber: 'GHI 789',
    fuelType: 'gasoline',
    cubicCapacity: '155',
    status: 'pending',
    submittedAt: '2024-01-18T16:45:00Z',
    documents: {
      driverLicense: '/placeholder.svg',
      officialReceipt: '/placeholder.svg',
      certificateOfRegistration: '/placeholder.svg'
    }
  },
  {
    id: '5',
    fullName: 'Carlos Mendoza',
    role: 'faculty',
    email: 'carlos.mendoza@ssedmmo.edu.ph',
    contact: '+63 920 333 4444',
    employmentType: 'part-time',
    vehicleType: 'car',
    manufacturer: 'Honda',
    model: 'City',
    color: 'Silver',
    plateNumber: 'JKL 012',
    fuelType: 'gasoline',
    status: 'approved',
    submittedAt: '2024-01-08T11:30:00Z',
    registrationCode: 'REG-1704710400000',
    documents: {
      driverLicense: '/placeholder.svg',
      officialReceipt: '/placeholder.svg',
      certificateOfRegistration: '/placeholder.svg'
    }
  }
];
