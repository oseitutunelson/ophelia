'use client';

import type { Profile } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import ProfileForm from '@/components/profile-form';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

export default function EditProfileModal({ isOpen, onClose, profile }: EditProfileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className='sm:max-w-lg border-lux-border rounded-none p-0 gap-0'>
        <DialogHeader className='px-8 pt-8 pb-6 border-b border-lux-border'>
          <DialogTitle className='font-display text-2xl font-bold text-lux-black'>
            Edit Profile
          </DialogTitle>
          <p className='text-sm text-lux-mid mt-1'>
            Update your Ophelia profile information.
          </p>
        </DialogHeader>
        <div className='px-8 py-7'>
          <ProfileForm profile={profile} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
