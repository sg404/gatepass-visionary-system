import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { hasActiveViolations, getSuspendedVehicles } from '@/utils/violationsStorage';

interface ViolationIndicatorProps {
  plateNumber: string;
  isEntry: boolean; // true for entry guard, false for exit guard
  onAllowEntry?: () => void;
  onDenyEntry?: () => void;
  onConfirmExit?: () => void;
  onDenyExit?: () => void;
}

const ViolationIndicator: React.FC<ViolationIndicatorProps> = ({
  plateNumber,
  isEntry,
  onAllowEntry,
  onDenyEntry,
  onConfirmExit,
  onDenyExit
}) => {
  // Determine violation status
  const isSuspended = getSuspendedVehicles().some(vehicle => vehicle.plateNumber === plateNumber);
  const hasViolations = hasActiveViolations(plateNumber);

  let status: 'green' | 'yellow' | 'red';
  let icon: React.ReactNode;
  let statusText: string;

  if (isSuspended) {
    status = 'red';
    icon = <XCircle className="h-4 w-4 text-red-600" />;
    statusText = 'Suspended - Multiple Penalties';
  } else if (hasViolations) {
    status = 'yellow';
    icon = <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    statusText = 'Minor Violation';
  } else {
    status = 'green';
    icon = <CheckCircle className="h-4 w-4 text-green-600" />;
    statusText = 'No Violations';
  }

  return (
    <div className="space-y-2">
      {/* Violation Indicator */}
      <div className="flex items-center justify-center gap-2 p-2 bg-gray-50 rounded-md">
        {icon}
        <span className={`text-xs font-medium ${
          status === 'green' ? 'text-green-700' :
          status === 'yellow' ? 'text-yellow-700' : 'text-red-700'
        }`}>
          {statusText}
        </span>
      </div>

      {/* Conditional Buttons */}
      <div className="flex gap-2">
        {status === 'red' ? (
          <Button
            onClick={isEntry ? onDenyEntry : onDenyExit}
            variant="destructive"
            className="flex-1"
          >
            {isEntry ? 'Deny Entry' : 'Deny Exit'}
          </Button>
        ) : (
          <Button
            onClick={isEntry ? onAllowEntry : onConfirmExit}
            className="flex-1"
          >
            {isEntry ? 'Allow Entry' : 'Confirm Exit'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ViolationIndicator;
