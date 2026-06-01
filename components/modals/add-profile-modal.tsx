'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import ProfileForm from '@/components/profile-form';
import { useAddProfileModal } from '@/hooks/use-add-profile-modal';

export default function AddProfileModal() {
  const { isOpen, onClose } = useAddProfileModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className='sm:max-w-lg border-lux-border rounded-none p-0 gap-0'>
        <DialogHeader className='px-8 pt-8 pb-6 border-b border-lux-border'>
          <DialogTitle className='font-display text-2xl font-bold text-lux-black'>
            Set Up Your Profile
          </DialogTitle>
          <p className='text-sm text-lux-mid mt-1'>
            Complete your Ophelia profile to get started.
          </p>
        </DialogHeader>
        <div className='px-8 py-7'>
          <ProfileForm onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
