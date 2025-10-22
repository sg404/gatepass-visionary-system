export interface Violation {
  id: string;
  plateNumber: string;
  ownerName: string;
  ownerType: string;
  violationType: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'investigating' | 'resolved' | 'escalated';
  reportedBy: string;
  reportedAt: string;
  location: string;
  evidence: string[];
  resolution?: {
    action: string;
    resolvedBy: string;
    resolvedAt: string;
    notes: string;
  };
}

const VIOLATIONS_STORAGE_KEY = 'gatepass_violations';

export const getViolations = (): Violation[] => {
  try {
    const stored = localStorage.getItem(VIOLATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading violations:', error);
    return [];
  }
};

export const saveViolations = (violations: Violation[]): void => {
  try {
    localStorage.setItem(VIOLATIONS_STORAGE_KEY, JSON.stringify(violations));
  } catch (error) {
    console.error('Error saving violations:', error);
  }
};

export const addViolation = (violation: Omit<Violation, 'id' | 'reportedAt'>): Violation => {
  const violations = getViolations();
  const newViolation: Violation = {
    ...violation,
    id: `V${String(violations.length + 1).padStart(3, '0')}`,
    reportedAt: new Date().toLocaleString(),
  };

  violations.push(newViolation);
  saveViolations(violations);
  return newViolation;
};

export const updateViolation = (id: string, updates: Partial<Violation>): void => {
  const violations = getViolations();
  const index = violations.findIndex(v => v.id === id);
  if (index !== -1) {
    violations[index] = { ...violations[index], ...updates };
    saveViolations(violations);
  }
};

export const getViolationsByPlate = (plateNumber: string): Violation[] => {
  const violations = getViolations();
  return violations.filter(v => v.plateNumber.toLowerCase() === plateNumber.toLowerCase());
};

export const hasActiveViolations = (plateNumber: string): boolean => {
  const violations = getViolationsByPlate(plateNumber);
  return violations.some(v => v.status !== 'resolved');
};

export const getSuspendedVehicles = (): string[] => {
  const violations = getViolations();
  const plateCounts: { [key: string]: number } = {};

  // Count violations per plate
  violations.forEach(v => {
    if (v.status === 'resolved') return; // Only count unresolved violations
    plateCounts[v.plateNumber] = (plateCounts[v.plateNumber] || 0) + 1;
  });

  // Return plates with 3+ violations (suspended threshold)
  return Object.keys(plateCounts).filter(plate => plateCounts[plate] >= 3);
};
