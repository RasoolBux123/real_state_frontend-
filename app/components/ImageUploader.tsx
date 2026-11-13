"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

type Props = {
  value: File[];
  onChange: (files: File[]) => void;
  max?: number;
};

export default function ImageUploader({ value, onChange, max = 10 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const previewsRef = useRef(previews);

  useEffect(() => {
    return () => previewsRef.current.forEach(({ url }) => URL.revokeObjectURL(url));
  }, []);

  function onFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    const allowed = selected.filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type));
    if (allowed.length !== selected.length) {
      setError("Choose JPEG, PNG, or WEBP images.");
      return;
    }
    const oversized = allowed.find((file) => file.size > 5 * 1024 * 1024);
    if (oversized) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }
    setError("");
    const added = allowed.slice(0, Math.max(0, max - value.length)).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    const next = [...previewsRef.current, ...added];
    previewsRef.current = next;
    setPreviews(next);
    onChange([...value, ...added.map(({ file }) => file)]);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {previews.map(({ file, url }, index) => (
          <div key={`${file.name}-${file.lastModified}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={file.name} className="h-full w-full object-cover" />
            {index === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">Cover</span>}
            <button type="button" aria-label="Remove image" onClick={() => {
              URL.revokeObjectURL(url);
              const next = previewsRef.current.filter((_, i) => i !== index);
              previewsRef.current = next;
              setPreviews(next);
              onChange(value.filter((_, i) => i !== index));
            }} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white">
              <X size={12} />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" onClick={() => inputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-gray-500 hover:bg-gray-50">
            <ImagePlus size={20} /> Add photos
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={onFiles} />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
