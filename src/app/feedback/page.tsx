
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageSquare, Send, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppLayout } from '@/components/app-layout';
import { useAuth } from '@/context/auth-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Faq } from '@/components/support/faq';

const FEEDBACK_STORAGE_KEY = 'kitamo-feedback';

interface FeedbackMessage {
    id: string;
    email: string;
    type: string;
    message: string;
}

interface StoredRating {
    email: string;
    rating: number;
}

interface StoredFeedback {
  ratings: StoredRating[];
  messages: FeedbackMessage[];
}

export default function FeedbackPage() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('general');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const [storedFeedback, setStoredFeedback] = useState<StoredFeedback>({ ratings: [], messages: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (item) {
        setStoredFeedback(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading feedback from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(storedFeedback));
      } catch (error) {
        console.error('Error saving feedback to localStorage', error);
      }
    }
  }, [storedFeedback, isLoaded]);
  
  const userHasRated = user?.email ? storedFeedback.ratings.some(r => r.email === user.email) : false;
  const userHasSubmittedFeedback = user?.email ? storedFeedback.messages.some(m => m.email === user.email) : false;


  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    let feedbackSubmitted = false;

    // Handle rating submission
    if (rating > 0 && !userHasRated) {
        setStoredFeedback(prev => ({
            ...prev,
            ratings: [...prev.ratings, { email: user.email!, rating }]
        }));
        feedbackSubmitted = true;
    }

    // Handle message submission
    if (feedbackMessage.trim().length > 0 && !userHasSubmittedFeedback) {
        const newMessage: FeedbackMessage = { 
            id: crypto.randomUUID(),
            email: user.email!,
            type: feedbackType, 
            message: feedbackMessage 
        };
        setStoredFeedback(prev => ({
            ...prev,
            messages: [newMessage, ...prev.messages]
        }));
        feedbackSubmitted = true;
    }

    if (feedbackSubmitted) {
        toast({
            title: 'Feedback Received!',
            description: "Thanks for your feedback. We'll use it to improve.",
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Nothing to Submit',
            description: 'Please provide a rating or a message before submitting.',
        });
    }
    
    setFeedbackMessage('');
    setRating(0);
    setFeedbackOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (feedbackToDelete) {
        setStoredFeedback(prev => ({
            ...prev,
            messages: prev.messages.filter(msg => msg.id !== feedbackToDelete)
        }));
        toast({
            title: 'Feedback Deleted',
            description: 'Your feedback has been removed.',
        });
        setFeedbackToDelete(null);
    }
  };

  const averageRating = storedFeedback.ratings.length > 0 
    ? (storedFeedback.ratings.reduce((a, b) => a + b.rating, 0) / storedFeedback.ratings.length).toFixed(1)
    : 'N/A';
    
  if (authLoading || !isLoaded) {
    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-48 mb-2" />
                                <Skeleton className="h-4 w-96" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-4 w-72" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-4 w-72" />
                        </CardHeader>
                        <CardContent className='space-y-2'>
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Feedback & Support</h1>
                <p className="text-muted-foreground">
                    Have questions? Find answers here or share your thoughts to help us improve.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-start gap-4">
                            <MessageSquare className="h-8 w-8 text-primary flex-shrink-0" />
                            <div>
                                <CardTitle>Share Your Thoughts</CardTitle>
                                <CardDescription>
                                    Your ratings and comments are invaluable in helping us make this app better for everyone.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        Give Feedback
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Share Your Feedback</DialogTitle>
                                        <DialogDescription>
                                        We'd love to hear your thoughts. What can we do better?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleFeedbackSubmit}>
                                        <div className="space-y-6 py-4">
                                            
                                            <div className="space-y-2">
                                                <Label>How would you rate our app?</Label>
                                                {userHasRated ? (
                                                    <p className="text-sm text-muted-foreground">You have already rated the app.</p>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={cn(
                                                            'h-8 w-8 cursor-pointer transition-colors',
                                                            (hoverRating || rating) >= star
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-muted-foreground'
                                                            )}
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                        />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Have written feedback?</Label>
                                                {userHasSubmittedFeedback ? (
                                                     <p className="text-sm text-muted-foreground">You have already submitted written feedback.</p>
                                                ) : (
                                                    <>
                                                        <Select value={feedbackType} onValueChange={setFeedbackType}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="general">General Feedback</SelectItem>
                                                                <SelectItem value="bug">Report a Bug</SelectItem>
                                                                <SelectItem value="feature">Feature Request</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Textarea
                                                            placeholder="Tell us more..."
                                                            rows={5}
                                                            value={feedbackMessage}
                                                            onChange={(e) => setFeedbackMessage(e.target.value)}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setFeedbackOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={userHasRated && userHasSubmittedFeedback}>
                                                <Send className="mr-2 h-4 w-4" />
                                                Submit Feedback
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-start gap-4">
                            <Star className="h-8 w-8 text-amber-400 flex-shrink-0" />
                            <div>
                                <CardTitle>Community Feedback</CardTitle>
                                <CardDescription>
                                    See what other users in the community are saying.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6 rounded-lg border p-4">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Average Rating</p>
                                    <p className="text-3xl font-bold">{averageRating}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Total Ratings</p>
                                    <p className="text-3xl font-bold">{storedFeedback.ratings.length}</p>
                                </div>
                            </div>
                            
                            <div>
                            <h4 className="text-md font-medium mb-2">What Users Are Saying</h4>
                            {storedFeedback.messages.length > 0 ? (
                                <ScrollArea className="h-48 w-full rounded-md border">
                                <div className="p-4 space-y-4">
                                    {storedFeedback.messages.map((msg) => (
                                    <div key={msg.id} className="text-sm p-3 bg-muted/50 rounded-md flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-semibold capitalize">{msg.type} Feedback</p>
                                            <p className="text-muted-foreground">{msg.message}</p>
                                        </div>
                                        {user?.email === msg.email && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setFeedbackToDelete(msg.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                    ))}
                                </div>
                                </ScrollArea>
                            ) : (
                                <div className="text-center text-muted-foreground py-6 rounded-lg border border-dashed">
                                No written feedback submitted yet.
                                </div>
                            )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Faq />
            </div>
        </div>
        
         <AlertDialog open={!!feedbackToDelete} onOpenChange={(open) => !open && setFeedbackToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your feedback.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setFeedbackToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </AppLayout>
  );
}
