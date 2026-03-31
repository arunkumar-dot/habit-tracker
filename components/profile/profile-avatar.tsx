"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

interface ProfileAvatarProps {
  imageUrl: string | null | undefined;
  name: string | null | undefined;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
}

/**
 * Circular avatar with a click-to-upload overlay.
 * Shows a local preview while uploading, and an initials fallback when no image exists.
 */
export function ProfileAvatar({ imageUrl, name, isUploading, onFileSelect }: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file);

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  }

  const displayUrl = preview ?? imageUrl;
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        className="relative w-24 h-24 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ ringColor: "var(--accent-primary)" } as React.CSSProperties}
        aria-label="Change profile photo"
      >
        {/* Avatar image or initials fallback */}
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={name ?? "Profile photo"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
            style={{ background: "var(--accent-primary)" }}
          >
            {initials}
          </div>
        )}

        {/* Hover overlay */}
        {!isUploading && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <Camera size={22} className="text-white" />
          </div>
        )}

        {/* Upload spinner overlay */}
        {isUploading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <Loader2 size={22} className="text-white animate-spin" />
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </button>

      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        Click to change photo
      </p>
    </div>
  );
}
