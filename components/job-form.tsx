'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { Job } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { useEdgeStore } from '@/lib/edgestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { SingleImageDropzone } from '@/components/single-image-dropzone';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface JobFormProps {
  job?: Job | null;
}

const formSchema = z.object({
  title: z.string().min(1, { message: 'Please enter job title.' }),
  description: z.string().min(10, { message: 'Please enter a detailed description.' }),
  category: z.string().min(1, { message: 'Please select a category.' }),
  jobType: z.string().min(1, { message: 'Please select job type.' }),
  location: z.string().optional(),
  salary: z.string().optional(),
  experience: z.string().optional(),
  image: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function JobForm({ job }: JobFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job?.title || '',
      description: job?.description || '',
      category: job?.category || '',
      jobType: job?.jobType || '',
      location: job?.location || '',
      salary: job?.salary || '',
      experience: job?.experience || '',
      image: job?.image || ''
    }
  });

  const fashionJobCategories = [
    { value: 'fashion-design', label: 'Fashion Design' },
    { value: 'tailor-seamstress', label: 'Tailor/Seamstress' },
    { value: 'pattern-making', label: 'Pattern Making' },
    { value: 'fashion-styling', label: 'Fashion Styling' },
    { value: 'wardrobe-consulting', label: 'Wardrobe Consulting' },
    { value: 'fashion-marketing', label: 'Fashion Marketing' },
    { value: 'fashion-writing', label: 'Fashion Writing' },
    { value: 'other-fashion', label: 'Other Fashion Jobs' }
  ];

  const jobTypes = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Contract', label: 'Contract' }
  ];

  const experienceLevels = [
    { value: 'Entry', label: 'Entry Level' },
    { value: 'Mid', label: 'Mid Level' },
    { value: 'Senior', label: 'Senior Level' }
  ];

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let imageUrl = values.image || '';

      if (file) {
        const res = await edgestore.publicImages.upload({
          file
        });
        imageUrl = res.url;
        setFile(undefined);
      }

      const payload = {
        ...values,
        image: imageUrl
      };

      if (job) {
        const res = await axios.patch(`/api/job/${job.id}`, payload);
        if (res.data?.success) {
          toast({
            title: 'Success',
            description: 'Job updated successfully'
          });
          router.push('/jobs');
        }
      } else {
        const res = await axios.post('/api/job', payload);
        if (res.data?.success) {
          toast({
            title: 'Success',
            description: 'Job posted successfully'
          });
          form.reset();
          router.push('/jobs');
        }
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <div className='w-full'>
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Image (Optional)</FormLabel>
                <FormControl>
                  <div className='w-full flex justify-center'>
                    <SingleImageDropzone
                      width={300}
                      height={200}
                      value={file}
                      onChange={setFile}
                      simple={true}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder='e.g., Senior Fashion Designer'
                    className='w-full'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full'>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder='Describe the job role, responsibilities, and requirements...'
                    rows={6}
                    className='w-full'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fashionJobCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='jobType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select job type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder='e.g., New York, NY'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='experience'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select experience level' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='salary'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary (Optional)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder='e.g., $50,000 - $80,000/year'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full pt-4'>
          <Button disabled={isLoading} type='submit' className='w-full rounded-lg h-10 text-base font-semibold'>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {job ? 'Update Job' : 'Post Job'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
