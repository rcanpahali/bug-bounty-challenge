import { Typography } from "@mui/material";
import { useIntervalEffect } from "@react-hookz/web";
import React, { useState } from "react";
import { STORAGE_KEYS } from "../../storage/keys";

const TOTAL_SECONDS = 3600; // 1 hour

function getOrInitStartTime(): number {
  const raw = localStorage.getItem(STORAGE_KEYS.TIMER_START);
  if (raw != null) {
    return JSON.parse(raw) as number;
  }
  const now = Date.now();
  localStorage.setItem(STORAGE_KEYS.TIMER_START, JSON.stringify(now));
  return now;
}

const CountdownTimer: React.FC = () => {
  const [startTime] = useState<number>(getOrInitStartTime);
  const [elapsed, setElapsed] = useState<number>(() => Math.floor((Date.now() - startTime) / 1000));

  const countdown = Math.max(0, TOTAL_SECONDS - elapsed);
  const countdownMinutes = String(Math.floor(countdown / 60)).padStart(2, "0");
  const countdownSeconds = String(countdown % 60).padStart(2, "0");

  useIntervalEffect(
    () => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    },
    countdown === 0 ? undefined : 1000
  );

  return (
    <Typography variant="h6" component="div" color="primary" aria-live="polite" aria-atomic="true" aria-label="Countdown timer">
      {countdownMinutes}:{countdownSeconds}
    </Typography>
  );
};

export default CountdownTimer;
