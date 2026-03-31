"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileForm } from "@/components/profile/profile-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function ProfilePage() {
  const { user, isLoading, updateProfile, uploadProfileImage, isSaving, isUploading } =
    useUserProfile();

  return (
    <>
      <PageHeader title="Profile" description="Manage your personal information" />

      <div className="max-w-lg mx-auto space-y-6">
        {/* Avatar card */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Skeleton width={96} height={96} className="rounded-full" />
              <Skeleton width={120} height={12} />
            </div>
          ) : (
            <ProfileAvatar
              imageUrl={user?.resolvedImageUrl}
              name={user?.name}
              isUploading={isUploading}
              onFileSelect={uploadProfileImage}
            />
          )}

          {/* Display name + email under avatar */}
          {!isLoading && user && (
            <div className="mt-4 text-center">
              <p className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                {user.name}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {user.email}
              </p>
              {user.location && (
                <p className="text-xs mt-1" style={{ color: "var(--text-disabled)" }}>
                  📍 {user.location}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Profile form card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          {isLoading ? (
            <div className="space-y-5">
              <Skeleton height={56} className="rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton height={56} className="rounded-xl" />
                <Skeleton height={56} className="rounded-xl" />
              </div>
              <Skeleton height={56} className="rounded-xl" />
              <Skeleton height={88} className="rounded-xl" />
              <Skeleton height={48} className="rounded-xl" />
            </div>
          ) : (
            <ProfileForm user={user} onSubmit={updateProfile} isSaving={isSaving} />
          )}
        </div>
      </div>
    </>
  );
}
