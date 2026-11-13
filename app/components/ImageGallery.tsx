"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const list = images.length ? images : ["/background.png"];
  const go = (d: number) => setIndex((i) => (i + d + list.length) % list.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={list[index]} alt={title} className="h-full w-full object-cover" />
        {list.length > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {index + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src + i}
              src={src}
              alt=""
              onClick={() => setIndex(i)}
              className={`h-16 w-24 shrink-0 cursor-pointer rounded-lg object-cover ${
                i === index ? "ring-2 ring-indigo-500" : "opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
