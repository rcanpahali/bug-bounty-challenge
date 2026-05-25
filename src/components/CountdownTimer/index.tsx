import { keyframes } from "@emotion/react";
import { mdiPause, mdiPlay, mdiTimerAlert } from "@mdi/js";
import Icon from "@mdi/react";
import { useIntervalEffect } from "@react-hookz/web";
import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TOTAL_SECONDS, useTimerElapsed, useTimerIsRunning, useTimerLoginStart } from "../../api/services/Timer";

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

  const timerState = isExpired ? "expired" : elapsedSeconds === 0 && !isRunning ? "idle" : isRunning ? "running" : "paused";

  useIntervalEffect(() => setNow(Date.now()), isRunning && !isExpired ? 1000 : undefined);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(Math.floor(remaining % 60)).padStart(2, "0");

  const iconPath = timerState === "paused" ? mdiPause : timerState === "expired" ? mdiTimerAlert : mdiPlay;
  const timeDisplay = timerState === "idle" ? "--:--" : `${minutes}:${seconds}`;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={0.5}
      aria-label={t("app.timer.label")}
      aria-live="polite"
      aria-atomic="true"
      sx={(theme) => ({
        color: timerState === "expired" ? theme.tokens.color.error : theme.tokens.color.primary,
        ...(timerState === "expired" && { animation: `${blink} 1s ease-in-out infinite` })
      })}
    >
      <Box component="span" sx={{ display: "flex" }}>
        <Icon path={iconPath} size={1} />
      </Box>
      <Typography variant="h6" component="span">
        {timeDisplay}
      </Typography>
    </Box>
  );
};

export default observer(CountdownTimer);
