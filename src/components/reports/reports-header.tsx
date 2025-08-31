
'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ReportsHeader() {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: 'Exporting Reports',
      description: 'Your reports are being generated and will download shortly. (This is a demo)',
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground">
          An overview of your financial health and activity.
        </p>
      </div>
      <Button onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
}
