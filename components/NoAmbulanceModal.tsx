// components/NoAmbulanceModal.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NoAmbulanceModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NoAmbulanceModal({ open, onClose }: NoAmbulanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-red-600">No Ambulance Found</DialogTitle>
          <DialogDescription>
            Unfortunately, we couldn't find any available ambulances nearby. Please call <strong>108</strong> immediately for emergency assistance.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
