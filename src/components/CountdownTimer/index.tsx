import { keyframes } from "@emotion/react";
import { useIntervalEffect } from "@react-hookz/web";
import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTimerElapsed, useTimerIsRunning, useTimerLoginStart } from "../../api/services/Timer";
import { TOTAL_SECONDS } from "../../api/services/Timer/store";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.15; }
`;

const CountdownTimer: React.FC = () => {
  const { t } = useTranslation();
  const elapsedSeconds = useTimerElapsed();
  const loginStart = useTimerLoginStart();
  const isRunning = useTimerIsRunning();

  const [now, setNow] = useState(() => Date.now());

  const effectiveNow = loginStart !== null ? Math.max(now, loginStart) : now;
  const liveElapsed = isRunning && loginStart !== null ? (effectiveNow - loginStart) / 1000 : 0;

  const totalElapsed = elapsedSeconds + liveElapsed;
  const remaining = Math.max(0, TOTAL_SECONDS - totalElapsed);
  const isExpired = totalElapsed >= TOTAL_SECONDS;

  const timerState = elapsedSeconds === 0 && !isRunning ? "idle" : isRunning ? "running" : "paused";

  useIntervalEffect(() => setNow(Date.now()), isRunning && !isExpired ? 1000 : undefined);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(Math.floor(remaining % 60)).padStart(2, "0");

  if (timerState === "idle") {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <Typography variant="h6" component="span" aria-label={t("app.timer.label")} sx={({ palette }) => ({ color: palette.primary.main })}>
          ▶ --:--
        </Typography>
      </Box>
    );
  }

  if (timerState === "paused") {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <Typography variant="h6" component="span" aria-label={t("app.timer.label")} sx={({ palette }) => ({ color: palette.primary.main })}>
          ⏸ {`${minutes}:${seconds}`}
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Typography
        variant="h6"
        component="span"
        aria-live="polite"
        aria-atomic="true"
        aria-label={t("app.timer.label")}
        sx={({ palette }) => ({
          color: isExpired ? palette.error.main : palette.primary.main,
          ...(isExpired && { animation: `${blink} 1s ease-in-out infinite` })
        })}
      >
        {isExpired ? `▶| ${minutes}:${seconds}` : `▶ ${minutes}:${seconds}`}
      </Typography>
    </Box>
  );
};

export default observer(CountdownTimer);
