
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Book,
  Camera,
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useTransactions } from '@/context/transaction-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface TransactionDetailsDialogProps {
  transaction: Transaction;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDialog({
  transaction,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  const [open, setOpen] = useState(true);
  const { updateTransaction } = useTransactions();
  const { toast } = useToast();

  const [notes, setNotes] = useState(transaction.notes || '');
  const [photoDataUri, setPhotoDataUri] = useState(
    transaction.photoDataUri || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNotes(transaction.notes || '');
    setPhotoDataUri(transaction.photoDataUri || null);
  }, [transaction]);

  const handleSave = () => {
    setIsSaving(true);
    const updatedTransaction = {
      ...transaction,
      notes,
      photoDataUri: photoDataUri || undefined,
    };
    updateTransaction(updatedTransaction);
    setIsSaving(false);
    toast({
      title: 'Details Saved',
      description: 'Your notes and photo have been updated.',
    });
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Please select an image smaller than 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoDataUri(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onOpenChange(false);
        setOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            View details, add notes, or upload a receipt for "
            {transaction.description}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any details, like warranty info or who you shared a meal with..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Photo Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Receipt Photo
            </Label>
            {photoDataUri ? (
              <div className="relative group">
                <Image
                  src={photoDataUri}
                  alt="Receipt"
                  width={400}
                  height={400}
                  className="rounded-md object-contain border bg-muted"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleRemovePhoto}
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remove photo</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Max file size: 2MB.
                </p>
              </div>
            )}
          </div>
          <Alert>
            <ImageIcon className="h-4 w-4" />
            <AlertTitle>Tip: Use Your Camera!</AlertTitle>
            <AlertDescription>
              On mobile, the upload button will let you take a photo directly
              with your device's camera.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
