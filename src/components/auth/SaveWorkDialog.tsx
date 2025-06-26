'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface SaveWorkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string) => Promise<void>;
  defaultTitle?: string;
}

const SaveWorkDialog: React.FC<SaveWorkDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  defaultTitle = '',
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your work');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(title.trim());
      toast.success('Work saved successfully!');
      onOpenChange(false);
      setTitle('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save work';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Your Work</DialogTitle>
          <DialogDescription>
            Give your work a name so you can find it later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2">
          <Label htmlFor="work-title">Title</Label>
          <Input
            id="work-title"
            placeholder="Enter a title for your work"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Work'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveWorkDialog;
