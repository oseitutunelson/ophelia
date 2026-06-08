'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { LEARN_CATEGORIES, COURSE_LEVELS } from '@/lib/learn-utils';

interface FormState {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: string;
  price: string;
  requirements: string[];
  objectives: string[];
  tags: string[];
  reqInput: string;
  objInput: string;
  tagInput: string;
}

function TagInput({
  label, items, input, onInput, onAdd, onRemove, placeholder,
}: {
  label: string; items: string[]; input: string;
  onInput: (v: string) => void; onAdd: () => void; onRemove: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className='block text-sm font-medium text-lux-black mb-1.5'>{label}</label>
      <div className='flex gap-2 mb-2'>
        <input
          value={input}
          onChange={e => onInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())}
          placeholder={placeholder}
          className='flex-1 border border-lux-border px-3 py-2 text-sm text-lux-black focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
        />
        <button type='button' onClick={onAdd} className='px-3 py-2 bg-lux-black text-white text-sm'>
          <Plus className='h-4 w-4' />
        </button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {items.map(item => (
          <span key={item} className='flex items-center gap-1.5 text-xs bg-lux-hover border border-lux-border px-3 py-1.5 text-lux-black'>
            {item}
            <button type='button' onClick={() => onRemove(item)}>
              <X className='h-3 w-3 text-lux-muted' />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CourseCreationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormState>({
    title: '', description: '', shortDescription: '',
    category: '', level: 'Beginner', price: '0',
    requirements: [], objectives: [], tags: [],
    reqInput: '', objInput: '', tagInput: '',
  });

  function f(key: keyof FormState, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function addItem(listKey: 'requirements' | 'objectives' | 'tags', inputKey: 'reqInput' | 'objInput' | 'tagInput') {
    const val = (form[inputKey] as string).trim();
    if (val && !(form[listKey] as string[]).includes(val)) {
      setForm(prev => ({
        ...prev,
        [listKey]: [...(prev[listKey] as string[]), val],
        [inputKey]: '',
      }));
    }
  }

  function removeItem(listKey: 'requirements' | 'objectives' | 'tags', val: string) {
    setForm(prev => ({ ...prev, [listKey]: (prev[listKey] as string[]).filter(v => v !== val) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      setError('Title, description, and category are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/courses', {
        title: form.title,
        description: form.description,
        shortDescription: form.shortDescription,
        category: form.category,
        level: form.level,
        price: form.price,
        requirements: form.requirements,
        objectives: form.objectives,
        tags: form.tags,
      });
      router.push(`/teach/courses/${res.data.id}/edit`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Failed to create course.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-2xl'>
      {/* Title */}
      <div>
        <label className='block text-sm font-medium text-lux-black mb-1.5'>Course Title *</label>
        <input
          value={form.title}
          onChange={e => f('title', e.target.value)}
          placeholder='e.g. Fashion Illustration Fundamentals'
          className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
          required
        />
      </div>

      {/* Short description */}
      <div>
        <label className='block text-sm font-medium text-lux-black mb-1.5'>Short Description</label>
        <input
          value={form.shortDescription}
          onChange={e => f('shortDescription', e.target.value)}
          placeholder='One-line pitch (shown in cards and search results)'
          className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
        />
      </div>

      {/* Full description */}
      <div>
        <label className='block text-sm font-medium text-lux-black mb-1.5'>Full Description *</label>
        <textarea
          value={form.description}
          onChange={e => f('description', e.target.value)}
          placeholder='Describe what students will learn, who this course is for, and what makes it unique...'
          rows={6}
          className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black resize-none focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
          required
        />
      </div>

      {/* Category + Level + Price */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-lux-black mb-1.5'>Category *</label>
          <div className='relative'>
            <select
              value={form.category}
              onChange={e => f('category', e.target.value)}
              className='w-full appearance-none border border-lux-border px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black bg-white pr-8'
              required
            >
              <option value=''>Select category</option>
              {LEARN_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lux-muted pointer-events-none' />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-lux-black mb-1.5'>Level</label>
          <div className='relative'>
            <select
              value={form.level}
              onChange={e => f('level', e.target.value)}
              className='w-full appearance-none border border-lux-border px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black bg-white pr-8'
            >
              {COURSE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lux-muted pointer-events-none' />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-lux-black mb-1.5'>Price (USD) — 0 = Free</label>
          <input
            value={form.price}
            onChange={e => f('price', e.target.value)}
            type='number'
            min='0'
            step='1'
            placeholder='0'
            className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
          />
        </div>
      </div>

      {/* Requirements */}
      <TagInput
        label='Course Requirements'
        items={form.requirements}
        input={form.reqInput}
        onInput={v => f('reqInput', v)}
        onAdd={() => addItem('requirements', 'reqInput')}
        onRemove={v => removeItem('requirements', v)}
        placeholder='e.g. No prior experience required'
      />

      {/* Objectives */}
      <TagInput
        label='What Students Will Learn'
        items={form.objectives}
        input={form.objInput}
        onInput={v => f('objInput', v)}
        onAdd={() => addItem('objectives', 'objInput')}
        onRemove={v => removeItem('objectives', v)}
        placeholder='e.g. Sketch fashion figures with confidence'
      />

      {/* Tags */}
      <TagInput
        label='Tags'
        items={form.tags}
        input={form.tagInput}
        onInput={v => f('tagInput', v)}
        onAdd={() => addItem('tags', 'tagInput')}
        onRemove={v => removeItem('tags', v)}
        placeholder='e.g. fashion, illustration, beginner'
      />

      {error && (
        <div className='p-4 bg-red-50 border border-red-200 text-red-700 text-sm'>{error}</div>
      )}

      <div className='flex gap-3 pt-2'>
        <button
          type='submit'
          disabled={loading}
          className='px-6 py-3 bg-lux-black text-white text-sm font-medium hover:bg-lux-dark transition-colors duration-200 disabled:opacity-50'
        >
          {loading ? 'Creating…' : 'Create Course'}
        </button>
        <button
          type='button'
          onClick={() => router.back()}
          className='px-6 py-3 border border-lux-border text-sm text-lux-mid hover:text-lux-black hover:border-lux-black transition-colors duration-200'
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
