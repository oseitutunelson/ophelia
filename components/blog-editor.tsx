'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo, Link2, Image as ImageIcon,
  Youtube as YoutubeIcon, AlignLeft, AlignCenter, AlignRight, Type,
} from 'lucide-react';
import { useCallback, useRef } from 'react';
import { useEdgeStore } from '@/lib/edgestore';
import { cn } from '@/lib/utils';

interface BlogEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded transition-colors duration-150',
        active ? 'bg-lux-black text-white' : 'text-lux-mid hover:bg-lux-hover hover:text-lux-black',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className='w-px h-5 bg-lux-border mx-1' />;
}

export default function BlogEditor({ content = '', onChange, placeholder = 'Write your story...' }: BlogEditorProps) {
  const { edgestore } = useEdgeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-gold-deep underline underline-offset-2 hover:text-gold' } }),
      Placeholder.configure({ placeholder }),
      Youtube.configure({ controls: true }),
      CharacterCount,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-5 font-sans text-lux-black',
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter YouTube URL:');
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    try {
      const res = await edgestore.publicImages.upload({ file });
      editor.chain().focus().setImage({ src: res.url, alt: file.name }).run();
    } catch {
      alert('Image upload failed. Please try again.');
    }
  }, [editor, edgestore]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = '';
  }, [handleImageUpload]);

  if (!editor) return null;

  const wordCount = editor.storage.characterCount?.words() ?? 0;
  const charCount = editor.storage.characterCount?.characters() ?? 0;

  return (
    <div className='border border-lux-border rounded-sm overflow-hidden bg-white'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-0.5 px-3 py-2 bg-lux-bg border-b border-lux-border'>
        {/* Text style */}
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title='Paragraph'>
          <Type className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title='Heading 1'>
          <Heading1 className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title='Heading 2'>
          <Heading2 className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title='Heading 3'>
          <Heading3 className='w-4 h-4' />
        </ToolbarButton>

        <Divider />

        {/* Inline marks */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title='Bold'>
          <Bold className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title='Italic'>
          <Italic className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title='Strikethrough'>
          <Strikethrough className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title='Inline code'>
          <Code className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title='Add link'>
          <Link2 className='w-4 h-4' />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title='Bullet list'>
          <List className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title='Numbered list'>
          <ListOrdered className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title='Blockquote'>
          <Quote className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title='Divider'>
          <Minus className='w-4 h-4' />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title='Align left'>
          <AlignLeft className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title='Align center'>
          <AlignCenter className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title='Align right'>
          <AlignRight className='w-4 h-4' />
        </ToolbarButton>

        <Divider />

        {/* Media */}
        <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={onFileChange} />
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title='Upload image'>
          <ImageIcon className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={addYoutube} title='Embed YouTube video'>
          <YoutubeIcon className='w-4 h-4' />
        </ToolbarButton>

        <Divider />

        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title='Undo'>
          <Undo className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title='Redo'>
          <Redo className='w-4 h-4' />
        </ToolbarButton>
      </div>

      {/* Editor content area */}
      <EditorContent editor={editor} />

      {/* Footer: word/char count */}
      <div className='flex items-center justify-end gap-4 px-4 py-2 bg-lux-bg border-t border-lux-border text-[11px] text-lux-muted'>
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}
