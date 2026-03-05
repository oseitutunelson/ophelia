'use client';

import { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
}

export default function MessageModal({
  isOpen,
  onClose,
  recipientId,
  recipientName
}: MessageModalProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`/api/messages/${recipientId}`, {
        message
      });

      if (res.data?.success) {
        toast({
          title: 'Success',
          description: 'Message sent successfully!'
        });
        setMessage('');
        onClose();
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Message {recipientName}</DialogTitle>
          <DialogDescription>
            Send a message to start a conversation
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <Textarea
              placeholder={`Hi ${recipientName.split(' ')[0]}, I'd like to get in touch...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='min-h-24 resize-none'
            />
          </div>
        </div>

        <div className='flex gap-2 justify-end'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className='rounded-full'
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}