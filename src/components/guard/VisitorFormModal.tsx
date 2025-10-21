import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Printer, CheckCircle } from 'lucide-react';

interface VisitorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedPlateNumber: string | null;
  onPassIssued?: (visitorData: any) => void;
}

const VisitorFormModal: React.FC<VisitorFormModalProps> = ({ isOpen, onClose, detectedPlateNumber, onPassIssued }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    plateNumber: detectedPlateNumber || '',
    purpose: '',
    customPurpose: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate temporary pass
    const passId = `TP${Date.now().toString().slice(-6)}`;
    const entryTime = new Date().toLocaleString();

    const pass = {
      passId,
      fullName: formData.fullName,
      plateNumber: formData.plateNumber,
      purpose: formData.purpose === 'others' ? formData.customPurpose : formData.purpose,
      entryTime,
      guardName: 'Current Guard' // Would be actual guard name from session
    };

    setGeneratedPass(pass);
    setIsSubmitted(true);

    // Call the callback if provided
    if (onPassIssued) {
      onPassIssued(pass);
    }

    // In real app, this would save to database
    console.log('Visitor pass generated:', pass);
  };

  const handlePrintPass = () => {
    // In real app, this would trigger printer
    window.print();
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setGeneratedPass(null);
    setFormData({
      fullName: '',
      plateNumber: '',
      purpose: '',
      customPurpose: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSubmitted ? 'Temporary Pass Generated' : 'Visitor Information'}
          </DialogTitle>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="plateNumber">Vehicle Plate Number</Label>
              <Input
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <Select value={formData.purpose} onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="meeting-dean">Meeting with Dean</SelectItem>
                  <SelectItem value="meeting-faculty">Meeting with Faculty</SelectItem>
                  <SelectItem value="meeting-staff">Meeting with Staff</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="event">Event/Program</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.purpose === 'others' && (
              <div>
                <Label htmlFor="customPurpose">Specify Purpose</Label>
                <Input
                  id="customPurpose"
                  value={formData.customPurpose}
                  onChange={(e) => setFormData({ ...formData, customPurpose: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Generate Pass</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-green-600 mb-4">
              <CheckCircle className="h-8 w-8 mr-2" />
              <span className="text-lg font-medium">Pass Generated Successfully!</span>
            </div>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-center border-b pb-2 mb-2">
                  <h3 className="font-bold">TEMPORARY GATE PASS</h3>
                  <p className="text-sm text-muted-foreground">Vehicle Entry Pass</p>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Pass ID:</span>
                    <span className="font-mono">{generatedPass?.passId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{generatedPass?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Plate:</span>
                    <span className="font-mono">{generatedPass?.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Purpose:</span>
                    <span>{generatedPass?.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Entry Time:</span>
                    <span>{generatedPass?.entryTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Issued by:</span>
                    <span>{generatedPass?.guardName}</span>
                  </div>
                </div>

                <div className="text-xs text-center text-muted-foreground border-t pt-2 mt-2">
                  Please return this pass upon exit
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handlePrintPass} variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Print Pass
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VisitorFormModal;
