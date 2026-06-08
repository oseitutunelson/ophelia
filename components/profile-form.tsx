'use client';

import * as z from 'zod';
import { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import isSlug from 'validator/es/lib/isSlug';
import type { Profile } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';

interface ProfileFormProps {
  profile?: Profile;
  onClose: () => void;
}

const formSchema = z.object({
  username: z
    .string()
    .toLowerCase()
    .min(3, { message: 'Please enter 3 or more characters.' })
    .refine((s) => isSlug(s), {
      message: 'Only letters, numbers, underscores or hyphens allowed.'
    }),
  bio: z.string().min(1, { message: 'Please enter a bio.' }),
  githubUrl: z.string().toLowerCase().url({ message: 'Please enter a valid GitHub URL.' }).optional().or(z.literal('')),
  linkedinUrl: z.string().toLowerCase().url({ message: 'Please enter a valid LinkedIn URL.' }).optional().or(z.literal(''))
});

const inputClass =
  'w-full px-4 py-2.5 border border-lux-border bg-white text-lux-black text-sm placeholder:text-lux-subtle focus:outline-none focus:border-lux-black/30 transition-colors duration-200';

export default function ProfileForm({ profile, onClose }: ProfileFormProps) {
  const router    = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username:    profile?.username    ?? '',
      bio:         profile?.bio         ?? '',
      githubUrl:   profile?.githubUrl   ?? '',
      linkedinUrl: profile?.linkedinUrl ?? ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/profile', values);
      if (res.data.success) {
        toast({ description: 'Profile saved successfully.' });
        if (profile) {
          onClose();
          router.push('/');
          router.refresh();
        } else {
          window.location.replace('/');
        }
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.error === 'Username is not available.') {
        form.setError('username', { type: 'manual', message: error.response.data.error });
      } else {
        toast({ variant: 'destructive', description: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username'    as const, label: 'Username',     placeholder: 'your-username',             type: 'input',    optional: false },
    { name: 'bio'         as const, label: 'Bio',          placeholder: 'Describe yourself…',        type: 'textarea', optional: false },
    { name: 'githubUrl'   as const, label: 'GitHub URL',   placeholder: 'https://github.com/you',    type: 'input',    optional: true },
    { name: 'linkedinUrl' as const, label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/…', type: 'input',    optional: true },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
        {fields.map(({ name, label, placeholder, type, optional }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className='gap-0'>
                <label className='text-luxury-label tracking-luxury text-lux-muted block mb-2 flex items-center gap-2'>
                  {label}
                  {optional && <span className='text-[10px] text-lux-subtle font-normal tracking-wide'>Optional</span>}
                </label>
                <FormControl>
                  {type === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={placeholder}
                      className={`${inputClass} resize-none`}
                      {...field}
                    />
                  ) : (
                    <input
                      type='text'
                      placeholder={placeholder}
                      className={inputClass}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage className='text-xs text-red-500 mt-1' />
              </FormItem>
            )}
          />
        ))}

        {/* Actions */}
        <div className='flex items-center justify-end gap-2.5 pt-3 border-t border-lux-border'>
          <button
            type='button'
            onClick={onClose}
            className='px-5 py-2.5 text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black border border-lux-border hover:border-lux-black/30 transition-all duration-200'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={loading}
            className='group inline-flex items-center gap-2 bg-lux-black hover:bg-lux-dark text-white px-6 py-2.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300 disabled:opacity-60'
          >
            {loading
              ? <><Loader2 size={12} className='animate-spin' /> Saving…</>
              : <><span>Save Changes</span><ArrowRight size={11} className='transition-transform duration-300 group-hover:translate-x-0.5' /></>
            }
          </button>
        </div>
      </form>
    </Form>
  );
}
