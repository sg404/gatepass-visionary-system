
export interface VehicleEntryLog {
  fullName: string;
  role: 'Student' | 'Faculty';
  stickerID: string;
  plateNumber: string;
  entryTime: string;
  exitTime?: string;
  status: 'Active' | 'Completed';
}

export interface VisitorEntryLog {
  fullName: string;
  plateNumber: string;
  purpose: string;
  passID: string;
  entryTime: string;
  exitTime?: string;
  status: 'Active' | 'Completed';
}
