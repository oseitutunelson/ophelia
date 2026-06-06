'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Tag, ChevronDown, Loader2, Eye, Save } from 'lucide-react';
import axios from 'axios';
import { useEdgeStore } from '@/lib/edgestore';
import { BLOG_CATEGORIES } from '@/lib/blog-utils';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const BlogEditor = dynamic(() => import('@/components/blog-editor'), { ssr: false });

interface BlogFormProps {
  mode?: 'create' | 'edit';
  initialData?: {
    slug?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    category?: string;
    tags?: string[];
    metaDescription?: string;
    status?: string;
  };
}

export default function BlogForm({ mode = 'create', initialData }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { edgestore } = useEdgeStore();

  const [title, setTitle] = useState(initialData?.title || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSeo, setShowSeo] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await edgestore.publicImages.upload({ file });
      setCoverImage(res.url);
    } catch {
      toast({ title: 'Upload failed', description: 'Could not upload cover image.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }, [edgestore, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
      if (!tags.includes(tag) && tags.length < 10) {
        setTags((prev) => [...prev, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = async (status: 'published' | 'draft') => {
    if (!title.trim()) { toast({ title: 'Title required', variant: 'destructive' }); return; }
    if (!content.trim()) { toast({ title: 'Content required', variant: 'destructive' }); return; }
    if (!category) { toast({ title: 'Category required', variant: 'destructive' }); return; }

    setSubmitting(true);
    try {
      const payload = { title, excerpt, content, coverImage: coverImage || null, category, tags, metaDescription, status };

      if (mode === 'edit' && initialData?.slug) {
        await axios.patch(`/api/blog/${initialData.slug}`, payload);
        toast({ title: 'Article updated!' });
        router.push(`/blog/${initialData.slug}`);
      } else {
        const { data } = await axios.post('/api/blog', payload);
        toast({ title: status === 'published' ? 'Article published!' : 'Draft saved!' });
        router.push(`/blog/${data.post.slug}`);
      }
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto px-5 lg:px-0 py-10'>
      {/* Header */}
      <div className='mb-8'>
        <p className='text-[10px] font-bold tracking-widest uppercase text-gold mb-2'>
          {mode === 'edit' ? 'Editing Article' : 'New Article'}
        </p>
        <h1 className='font-display text-3xl lg:text-4xl text-lux-black'>
          {mode === 'edit' ? 'Edit your story' : 'Share your story'}
        </h1>
      </div>

      <div className='space-y-7'>
        {/* Cover Image */}
        <div>
          <label className='block text-xs font-semibold tracking-wider uppercase text-lux-mid mb-2'>
            Cover Image
          </label>
          {coverImage ? (
            <div className='relative aspect-[16/7] overflow-hidden group'>
              <Image src={coverImage} alt='Cover' fill className='object-cover' />
              <button
                type='button'
                onClick={() => setCoverImage('')}
                className='absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-sm aspect-[16/7] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200',
                isDragActive ? 'border-gold bg-gold/5' : 'border-lux-border hover:border-lux-subtle bg-lux-bg'
              )}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <Loader2 className='w-8 h-8 text-lux-muted animate-spin' />
              ) : (
                <>
                  <Upload className='w-8 h-8 text-lux-muted mb-3' />
                  <p className='text-sm text-lux-mid font-medium'>Drop your cover image here</p>
                  <p className='text-xs text-lux-muted mt-1'>PNG, JPG up to 10MB · Recommended 1600×700</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Article title...'
            className='w-full font-display text-3xl lg:text-4xl text-lux-black placeholder:text-lux-border border-0 border-b-2 border-lux-border focus:border-lux-black outline-none bg-transparent py-2 transition-colors duration-200'
          />
          <p className='text-xs text-lux-muted mt-1.5'>{title.length}/120 characters</p>
        </div>

        {/* Category + Tags row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div>
            <label className='block text-xs font-semibold tracking-wider uppercase text-lux-mid mb-2'>
              Category <span className='text-rose-500'>*</span>
            </label>
            <div className='relative'>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full appearance-none border border-lux-border bg-white px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black transition-colors pr-10'
              >
                <option value=''>Select a category...</option>
                {BLOG_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lux-muted pointer-events-none' />
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold tracking-wider uppercase text-lux-mid mb-2'>
              Tags
            </label>
            <div className='border border-lux-border bg-white px-3 py-2 min-h-[48px] flex flex-wrap gap-1.5 items-center focus-within:border-lux-black transition-colors'>
              {tags.map((tag) => (
                <span key={tag} className='flex items-center gap-1 text-xs bg-lux-hover text-lux-dark px-2 py-0.5 rounded-sm'>
                  #{tag}
                  <button type='button' onClick={() => removeTag(tag)} className='hover:text-rose-600'>
                    <X className='w-3 h-3' />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={tags.length < 10 ? 'Add tag, press Enter' : 'Max 10 tags'}
                disabled={tags.length >= 10}
                className='flex-1 min-w-20 text-sm outline-none bg-transparent placeholder:text-lux-muted'
              />
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className='block text-xs font-semibold tracking-wider uppercase text-lux-mid mb-2'>
            Excerpt <span className='text-lux-muted font-normal normal-case'>(optional)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder='A brief summary that appears on article cards and in search results...'
            rows={3}
            maxLength={300}
            className='w-full border border-lux-border bg-white px-4 py-3 text-sm text-lux-black placeholder:text-lux-muted focus:outline-none focus:border-lux-black transition-colors resize-none'
          />
          <p className='text-xs text-lux-muted text-right mt-1'>{excerpt.length}/300</p>
        </div>

        {/* Content Editor */}
        <div>
          <label className='block text-xs font-semibold tracking-wider uppercase text-lux-mid mb-2'>
            Content <span className='text-rose-500'>*</span>
          </label>
          <BlogEditor content={content} onChange={setContent} placeholder='Write your article here...' />
        </div>

        {/* SEO Section (collapsible) */}
        <div className='border border-lux-border'>
          <button
            type='button'
            onClick={() => setShowSeo((v) => !v)}
            className='w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-lux-dark hover:bg-lux-bg transition-colors'
          >
            <span>SEO Settings</span>
            <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', showSeo && 'rotate-180')} />
          </button>
          {showSeo && (
            <div className='px-5 pb-5 space-y-4 border-t border-lux-border'>
              <div>
                <label className='block text-xs font-semibold tracking-wider uppercase text-lux-mid mb-2 mt-4'>
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder='SEO-optimised description for search engines (max 160 chars)...'
                  rows={2}
                  maxLength={160}
                  className='w-full border border-lux-border bg-white px-4 py-3 text-sm text-lux-black placeholder:text-lux-muted focus:outline-none focus:border-lux-black transition-colors resize-none'
                />
                <p className='text-xs text-lux-muted text-right mt-1'>{metaDescription.length}/160</p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className='flex items-center gap-3 pt-2'>
          <button
            type='button'
            onClick={() => handleSubmit('published')}
            disabled={submitting}
            className='flex items-center gap-2 px-8 py-3 bg-lux-black text-white text-sm font-semibold tracking-wider uppercase hover:bg-lux-dark transition-colors disabled:opacity-50'
          >
            {submitting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Eye className='w-4 h-4' />}
            Publish
          </button>
          <button
            type='button'
            onClick={() => handleSubmit('draft')}
            disabled={submitting}
            className='flex items-center gap-2 px-6 py-3 border border-lux-border text-lux-dark text-sm font-semibold tracking-wider uppercase hover:bg-lux-bg transition-colors disabled:opacity-50'
          >
            <Save className='w-4 h-4' />
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
