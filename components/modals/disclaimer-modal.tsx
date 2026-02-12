'use client';

import { useEffect, useState } from 'react';

import useStore from '@/hooks/use-store';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import useDisclaimerModal from '@/hooks/use-disclaimer-modal';

export default function DisclaimerModal() {
  const [isMounted, setIsMounted] = useState(false);
  const disclaimer = useStore(useDisclaimerModal, (state) => state);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title='Welcome to Ophelia!'
      description='This is a creative showcase platform built exclusively for fashion designers and creators. It allows designers to upload, share, and discover fashion concepts—ranging from sketches and mood boards to finished garments and collections.

Just like Dribbble empowers digital designers, Ophelia gives fashion creatives a dedicated space to present their work, build a following, and gain visibility among brands, collaborators, and fashion enthusiasts. Designers can explore trends, get inspired, receive feedback, and connect with a global community that values originality and craftsmanship.

Whether you’re an emerging designer or an established creative, Ophelia is where fashion ideas live, evolve, and get noticed.'
      isOpen={disclaimer?.isOpen}
      onClose={disclaimer?.onClose}
      disclaimer={true}
    >
      <div className='pt-2 space-x-2 flex items-center justify-end w-full'>
        <Button
          onClick={disclaimer?.onClose}
          type='button'
          className='rounded-full'
        >
          Got it, thanks!
        </Button>
      </div>
    </Modal>
  );
}
