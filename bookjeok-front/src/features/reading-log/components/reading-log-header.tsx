"use client";

import { useEffect, useState } from "react";

import { useUpdateUserMutation } from "@/features/user/mutations";
import { Label } from "@/shared/components/shadcn/label";
import { Switch } from "@/shared/components/shadcn/switch";

import { useReadingLogSettingsQuery } from "../queries";

export function ReadingLogHeader() {
  const { data: settings } = useReadingLogSettingsQuery();
  const { mutate: updateUser, isPending } = useUpdateUserMutation();
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (settings) {
      setIsPublic(settings.isReadingLogPublic ?? true);
    }
  }, [settings]);

  const handleToggle = (checked: boolean) => {
    setIsPublic(checked);
    updateUser({ isReadingLogPublic: checked });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">독서 기록</h1>
        <p className="text-muted-foreground">
          언제 어떤 책을 읽었는지 기록해보세요.
        </p>
      </div>

      <div className="flex items-center space-x-2 bg-secondary/50 p-3 rounded-lg">
        <Switch
          id="public-mode"
          checked={isPublic}
          disabled={isPending}
          onCheckedChange={handleToggle}
        />
        <div className="flex flex-col">
          <Label htmlFor="public-mode" className="font-medium">
            프로필 공개
          </Label>
          <span className="text-xs text-muted-foreground">
            {isPublic
              ? "내 프로필에 독서 기록 타임라인이 표시됩니다."
              : "나만 볼 수 있습니다."}
          </span>
        </div>
      </div>
    </div>
  );
}
