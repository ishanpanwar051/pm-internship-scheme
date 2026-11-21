import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  minTagsMessage?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags = [],
  onChange,
  suggestions = [],
  placeholder = 'Add a skill...',
  maxTags = 25,
  minTagsMessage,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions
    .filter(
      (s) =>
        s.toLowerCase().includes(inputVal.toLowerCase()) &&
        !tags.some((t) => t.toLowerCase() === s.toLowerCase())
    )
    .slice(0, 6);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (tags.length >= maxTags) return;
    if (!tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
    }
    setInputVal('');
    setShowSuggestions(false);
  };

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-gov-navy dark:focus-within:ring-blue-500 min-h-[46px]">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-in fade-in"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="ml-1.5 hover:text-emerald-950 dark:hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="relative flex-1 min-w-[140px]">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="w-full bg-transparent text-xs outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />

          {showSuggestions && inputVal && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden py-1">
              {filteredSuggestions.map((item, i) => (
                <div
                  key={i}
                  onMouseDown={() => addTag(item)}
                  className="px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
                >
                  <span>{item}</span>
                  <Plus className="w-3 h-3 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {minTagsMessage && tags.length < 3 && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
          {minTagsMessage} (Currently: {tags.length})
        </p>
      )}
    </div>
  );
};

export default TagInput;
