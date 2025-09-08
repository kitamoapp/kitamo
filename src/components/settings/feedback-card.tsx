
'use client';

import { useState } from 'react';
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

export function FeedbackCard() {
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('general');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'No Rating Selected',
        description: 'Please select a star rating before submitting.',
      });
      return;
    }
    // In a real app, send the rating to your server
    console.log(`User rated the app: ${rating} stars`);
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
    // In a real app, you would send this feedback to your server
    console.log({
      type: feedbackType,
      message: feedbackMessage,
    });
    toast({
      title: 'Feedback Sent!',
      description: "Thanks for your feedback. We'll use it to improve.",
    });
    setFeedbackMessage('');
    setFeedbackOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback & Support</CardTitle>
        <CardDescription>
          Help us improve by sharing your thoughts or rating the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
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
      </CardContent>
    </Card>
  );
}
