
export interface AccessLog {
  dateTime: Date;
  user: string;
  role: string;
  action: string;
  description: string;
  entryGateOldSite: string;
  exitGateOldSite: string;
  dutyType: string;
  site: string;
  temporaryPassDetails: string;
}
