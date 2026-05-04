"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Download, Smartphone, Trash2 } from "lucide-react";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileForm } from "@/components/profile/profile-form";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/components/ui/toast";
import { downloadUserDataExport } from "@/lib/export-client";
import * as Sentry from "@sentry/nextjs";

export default function SettingsPage() {
  const { getToken } = useAuth();
  const { showToast } = useToast();
  const { user, isLoading, updateProfile, uploadProfileImage, isSaving, isUploading } =
    useUserProfile();

  const { state: installState, promptInstall } = usePWAInstall();
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleExport() {
    setIsExporting(true);
    try {
      await downloadUserDataExport(getToken);
      showToast("Export downloaded successfully.", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed.";
      showToast(message, "error");
      Sentry.captureException(err, { tags: { action: "exportUserData" } });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and data" />

      <div className="max-w-lg mx-auto space-y-6">
        {/* ── Avatar ───────────────────────────────────────────────────────── */}
        <div
          className="rounded-lg p-6 flex flex-col items-center shadow-warm-sm"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
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
          {!isLoading && user && (
            <div className="mt-4 text-center">
              <p className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                {user.name}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {user.email}
              </p>
            </div>
          )}
        </div>

        {/* ── Profile form ─────────────────────────────────────────────────── */}
        <div
          className="rounded-lg p-6 shadow-warm-sm"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
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

        {/* ── Export ───────────────────────────────────────────────────────── */}
        <div
          className="rounded-lg p-6 shadow-warm-sm space-y-4"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Export your data
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Download all your habit data as a JSON file.
            </p>
          </div>
          <Button
            variant="secondary"
            size="md"
            isLoading={isExporting}
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={16} aria-hidden="true" />
            Export my data
          </Button>
        </div>

        {/* ── Install app ──────────────────────────────────────────────────── */}
        {installState !== "unavailable" && (
          <div
            className="rounded-lg p-6 shadow-warm-sm space-y-4"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <div>
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Install app
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                {installState === "installed"
                  ? "HabitFlow is installed on this device."
                  : "Add HabitFlow to your home screen for quick access and offline support."}
              </p>
            </div>

            {installState === "ready" && (
              <Button
                variant="secondary"
                size="md"
                onClick={promptInstall}
                className="flex items-center gap-2"
              >
                <Smartphone size={16} aria-hidden="true" />
                Add to Home Screen
              </Button>
            )}

            {installState === "installed" && (
              <p className="text-sm font-medium" style={{ color: "var(--success)" }}>
                ✓ Installed
              </p>
            )}
          </div>
        )}

        {/* ── Danger Zone ──────────────────────────────────────────────────── */}
        <div
          className="rounded-lg p-6 shadow-warm-sm space-y-4"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid color-mix(in srgb, var(--danger) 30%, var(--border-subtle))",
          }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--danger)" }}>
              Danger Zone
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Permanently delete your account and all associated data. This action
              is immediate and cannot be undone.
            </p>
          </div>
          <Button
            variant="danger"
            size="md"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} aria-hidden="true" />
            Delete my account
          </Button>
        </div>
      </div>

      <DeleteAccountDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
