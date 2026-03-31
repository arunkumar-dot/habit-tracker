"use client";

import { useState } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/toast";
import type { Doc } from "@/convex/_generated/dataModel";

export type ProfileUser = Doc<"users"> & { resolvedImageUrl: string | null };

export interface ProfileFormValues {
  name: string;
  age?: number | "";
  sex?: "male" | "female" | "other";
  location?: string;
  bio?: string;
}

/**
 * Provides current user profile data and helpers to update it or upload a new photo.
 */
export function useUserProfile(): {
  user: ProfileUser | null | undefined;
  isLoading: boolean;
  updateProfile: (data: ProfileFormValues) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<void>;
  isSaving: boolean;
  isUploading: boolean;
  error: string | null;
} {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const { showToast } = useToast();

  const raw = useQuery(
    api.users.getCurrentUser,
    !authLoading && isAuthenticated ? {} : "skip"
  );
  const user = raw as ProfileUser | null | undefined;
  const isLoading = authLoading || (isAuthenticated && raw === undefined);

  const updateProfileMutation = useMutation(api.users.updateProfile);
  const generateUploadUrlMutation = useMutation(api.users.generateUploadUrl);
  const saveProfileImageMutation = useMutation(api.users.saveProfileImage);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateProfile(data: ProfileFormValues) {
    setIsSaving(true);
    setError(null);
    try {
      await updateProfileMutation({
        name: data.name,
        age: typeof data.age === "number" ? data.age : undefined,
        sex: data.sex,
        location: data.location || undefined,
        bio: data.bio || undefined,
      });
      showToast("Profile saved!", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadProfileImage(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      // Step 1: get signed upload URL
      const uploadUrl = await generateUploadUrlMutation({});

      // Step 2: POST image bytes directly to Convex storage
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Image upload failed. Please try again.");
      }

      const { storageId } = (await response.json()) as { storageId: string };

      // Step 3: save storageId on the user record
      await saveProfileImageMutation({
        storageId: storageId as Parameters<typeof saveProfileImageMutation>[0]["storageId"],
      });

      showToast("Profile photo updated!", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Image upload failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsUploading(false);
    }
  }

  return {
    user,
    isLoading,
    updateProfile,
    uploadProfileImage,
    isSaving,
    isUploading,
    error,
  };
}
