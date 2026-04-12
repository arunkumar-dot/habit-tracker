"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CityAutocomplete } from "./city-autocomplete";
import type { ProfileFormValues, ProfileUser } from "@/hooks/use-user-profile";

// ============================================
// Validation schema
// ============================================

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(1, "Age must be at least 1").max(150, "Age must be under 150").optional()
  ),
  sex: z.enum(["male", "female", "other"]).optional(),
  location: z.string().optional(),
  bio: z.string().max(300, "Bio must be 300 characters or fewer").optional(),
});

// Use z.infer on the output type to avoid the `age: unknown` resolver mismatch
type ProfileSchemaValues = {
  name: string;
  age?: number;
  sex?: "male" | "female" | "other";
  location?: string;
  bio?: string;
};

// ============================================
// Component
// ============================================

interface ProfileFormProps {
  user: ProfileUser | null | undefined;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isSaving: boolean;
}

const SEX_OPTIONS: { value: "male" | "female" | "other"; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export function ProfileForm({ user, onSubmit, isSaving }: ProfileFormProps) {
  const [savedRecently, setSavedRecently] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileSchemaValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: "",
      age: undefined,
      sex: undefined,
      location: "",
      bio: "",
    },
  });

  // Pre-fill with existing user data once loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        age: user.age ?? undefined,
        sex: user.sex ?? undefined,
        location: user.location ?? "",
        bio: user.bio ?? "",
      });
    }
  }, [user, reset]);

  const selectedSex = watch("sex");
  const bio = watch("bio") ?? "";

  async function handleFormSubmit(values: ProfileSchemaValues) {
    await onSubmit(values as ProfileFormValues);
    setSavedRecently(true);
    setTimeout(() => setSavedRecently(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Name */}
      <Input
        label="Name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />

      {/* Age + Sex row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          placeholder="e.g. 28"
          min={1}
          max={150}
          error={errors.age?.message}
          {...register("age")}
        />

        {/* Sex selector */}
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Sex
          </p>
          <div className="flex gap-2">
            {SEX_OPTIONS.map((opt) => {
              const isActive = selectedSex === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("sex", opt.value, { shouldValidate: true })}
                  className="flex-1 py-2 text-xs font-medium rounded-xl transition-colors"
                  style={
                    isActive
                      ? { background: "var(--accent-primary)", color: "white" }
                      : {
                          background: "var(--bg-input)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border)",
                        }
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Location — city autocomplete */}
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <CityAutocomplete
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.location?.message}
            name={field.name}
          />
        )}
      />

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Bio
          </label>
          <span
            className="text-xs"
            style={{ color: bio.length > 280 ? "var(--accent-danger)" : "var(--text-disabled)" }}
          >
            {bio.length}/300
          </span>
        </div>
        <Textarea
          placeholder="A short description about yourself (optional)"
          rows={3}
          error={errors.bio?.message}
          {...register("bio")}
        />
      </div>

      {/* Save button */}
      <Button
        type="submit"
        variant={savedRecently ? "success" : "primary"}
        size="lg"
        isLoading={isSaving}
        className="w-full"
      >
        {savedRecently ? "✓ Saved!" : isSaving ? "Saving…" : "Save Profile"}
      </Button>
    </form>
  );
}
