
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
import { Star, MessageSquare, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

const FEEDBACK_STORAGE_KEY = 'kitamo-feedback';

interface StoredFeedback {
  ratings: number[];
  messages: { type: string; message: string }[];
}

export function FeedbackCard() {
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('general');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const [storedFeedback, setStoredFeedback] = useState<StoredFeedback>({ ratings: [], messages: [] });
  const [isLoaded, setIsLoaded] = useState(false);

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


  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'No Rating Selected',
        description: 'Please select a star rating before submitting.',
      });
      return;
    }
    setStoredFeedback(prev => ({
        ...prev,
        ratings: [...prev.ratings, rating]
    }));
    toast({
      title: 'Thank You for Your Rating!',
      description: `You gave the app ${rating} out of 5 stars. We appreciate your feedback!`,
    });
    setRatingOpen(false);
    setRating(0);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackMessage.trim().length === 0) {
      toast({
        variant: 'destructive',
        title: 'Empty Feedback',
        description: 'Please write a message before submitting.',
      });
      return;
    }
    const newMessage = { type: feedbackType, message: feedbackMessage };
    setStoredFeedback(prev => ({
        ...prev,
        messages: [newMessage, ...prev.messages]
    }));
    toast({
      title: 'Feedback Sent!',
      description: "Thanks for your feedback. We'll use it to improve.",
    });
    setFeedbackMessage('');
    setFeedbackOpen(false);
  };
  
  const averageRating = storedFeedback.ratings.length > 0 
    ? (storedFeedback.ratings.reduce((a, b) => a + b, 0) / storedFeedback.ratings.length).toFixed(1)
    : 'N/A';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback & Support</CardTitle>
        <CardDescription>
          Help us improve by sharing your thoughts or rating the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Dialog open={ratingOpen} onOpenChange={setRatingOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Star className="mr-2 h-4 w-4" />
                Rate the App
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How would you rate our app?</DialogTitle>
                <DialogDescription>
                  Your feedback helps us improve. Please select a rating below.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center items-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-10 w-10 cursor-pointer transition-colors',
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRatingOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleRatingSubmit}>
                  Submit Rating
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
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
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="feedback-type">Feedback Type</Label>
                    <Select value={feedbackType} onValueChange={setFeedbackType}>
                      <SelectTrigger id="feedback-type">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Feedback</SelectItem>
                        <SelectItem value="bug">Report a Bug</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback-message">Message</Label>
                    <Textarea
                      id="feedback-message"
                      placeholder="Tell us more..."
                      rows={6}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                    />
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
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
            <h3 className="text-lg font-medium">Community Feedback</h3>
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
                    {storedFeedback.messages.map((msg, index) => (
                      <div key={index} className="text-sm p-3 bg-muted/50 rounded-md">
                        <p className="font-semibold capitalize">{msg.type} Feedback</p>
                        <p className="text-muted-foreground">{msg.message}</p>
                      </div>
                    ))}
                   </div>
                </ScrollArea>
              ) : (
                <div className="text-center text-muted-foreground py-6 rounded-lg border border-dashed">
                  No feedback submitted yet.
                </div>
              )}
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
