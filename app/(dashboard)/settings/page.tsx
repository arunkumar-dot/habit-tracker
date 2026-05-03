"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Download, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { useToast } from "@/components/ui/toast";
import { downloadUserDataExport } from "@/lib/export-client";
import * as Sentry from "@sentry/nextjs";

export default function SettingsPage() {
  const { getToken } = useAuth();
  const { showToast } = useToast();

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
