'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Code, Heading1, Heading2, List, ListOrdered, Quote, 
  Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon,
  AlignLeft, AlignCenter, AlignRight, Undo, Redo
} from 'lucide-react';
import { useState } from 'react';

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Désactiver les extensions qu'on va remplacer
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-orange-500 underline hover:text-orange-600',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'rounded-lg mx-auto',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  const addYoutube = () => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
      setYoutubeUrl('');
      setShowYoutubeInput(false);
    }
  };

  const MenuButton = ({ onClick, active, children, title }: any) => (
    <button
      onClick={onClick}
      type="button"
      title={title}
      className={`p-2 rounded hover:bg-zinc-700 transition ${
        active ? 'bg-zinc-700 text-orange-500' : 'text-zinc-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-zinc-700 rounded-lg bg-black overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-zinc-700 p-2 flex flex-wrap gap-1 bg-zinc-900">
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Annuler"
        >
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Refaire"
        >
          <Redo className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Gras"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italique"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Souligné"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Barré"
        >
          <Strikethrough className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Titre 1"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Titre 2"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Liste à puces"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Liste numérotée"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Citation"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Aligner à gauche"
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Centrer"
        >
          <AlignCenter className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Aligner à droite"
        >
          <AlignRight className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        <MenuButton
          onClick={() => setShowLinkInput(!showLinkInput)}
          active={editor.isActive('link')}
          title="Ajouter un lien"
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => setShowImageInput(!showImageInput)}
          title="Ajouter une image"
        >
          <ImageIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => setShowYoutubeInput(!showYoutubeInput)}
          title="Ajouter une vidéo YouTube"
        >
          <YoutubeIcon className="w-4 h-4" />
        </MenuButton>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-3 bg-zinc-900 border-b border-zinc-700 flex gap-2">
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLink()}
            className="flex-1 px-3 py-2 bg-black border border-zinc-700 rounded text-sm focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={addLink}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-semibold"
          >
            Ajouter
          </button>
          <button
            onClick={() => setShowLinkInput(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="p-3 bg-zinc-900 border-b border-zinc-700 flex gap-2">
          <input
            type="url"
            placeholder="URL de l'image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addImage()}
            className="flex-1 px-3 py-2 bg-black border border-zinc-700 rounded text-sm focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={addImage}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-semibold"
          >
            Ajouter
          </button>
          <button
            onClick={() => setShowImageInput(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm"
          >
            Annuler
          </button>
        </div>
      )}

      {/* YouTube Input */}
      {showYoutubeInput && (
        <div className="p-3 bg-zinc-900 border-b border-zinc-700 flex gap-2">
          <input
            type="url"
            placeholder="URL YouTube"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addYoutube()}
            className="flex-1 px-3 py-2 bg-black border border-zinc-700 rounded text-sm focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={addYoutube}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-semibold"
          >
            Ajouter
          </button>
          <button
            onClick={() => setShowYoutubeInput(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
