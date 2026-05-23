import { keyframes } from "@emotion/react";
import { useIntervalEffect, useLocalStorageValue } from "@react-hookz/web";
import { Typography } from "@mui/material";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { STORAGE_KEYS } from "../../storage/keys";

const TOTAL_SECONDS = 3600;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.15; }
`;

const CountdownTimer: React.FC = () => {
  const { t } = useTranslation();
  const { value: startTime } = useLocalStorageValue<number | null>(STORAGE_KEYS.TIMER_START, {
    defaultValue: null,
    initializeWithValue: true
  });

  const [now, setNow] = useState(() => Date.now());

  const elapsed = startTime != null ? Math.max(0, Math.floor((now - startTime) / 1000)) : null;
  const remaining = elapsed != null ? Math.max(0, TOTAL_SECONDS - elapsed) : null;

  useIntervalEffect(() => setNow(Date.now()), startTime != null && (remaining ?? 1) > 0 ? 1000 : undefined);

  const isExpired = remaining === 0;
  const minutes = remaining != null ? String(Math.floor(remaining / 60)).padStart(2, "0") : "--";
  const seconds = remaining != null ? String(remaining % 60).padStart(2, "0") : "--";
  const display = `${minutes}:${seconds}`;

  return (
    <Typography
      variant="h6"
      component="div"
      aria-live="polite"
      aria-atomic="true"
      aria-label={t("app.timer.label")}
      sx={({ palette }) => ({
        color: isExpired ? palette.error.main : palette.primary.main,
        ...(isExpired && { animation: `${blink} 1s ease-in-out infinite` })
      })}
    >
      {display}
    </Typography>
  );
};

export default observer(CountdownTimer);
