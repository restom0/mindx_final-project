import {Pause, Play, RotateCcw} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import Button from "./Button.jsx";
import Card from "./Card.jsx";

const modes = {
  focus: 25 * 60,
  break: 5 * 60
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

function FocusMode({task, onRecord}) {
  const {t} = useTranslation();
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(modes.focus);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(modes[mode]);
    setRunning(false);
  }, [mode, task?.id]);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          onRecord({
            todoId: task?.id || null,
            mode: mode === "focus" ? "focus" : "short_break",
            durationMinutes: mode === "focus" ? 25 : 5,
            completedTask: false,
            startedAt: new Date(Date.now() - modes[mode] * 1000).toISOString(),
            completedAt: new Date().toISOString()
          });
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [mode, onRecord, running, task?.id]);

  const progress = useMemo(() => Math.round(((modes[mode] - secondsLeft) / modes[mode]) * 100), [mode, secondsLeft]);

  return (
    <Card className="focus-mode">
      <div>
        <span>{t("advanced.focusMode")}</span>
        <h2>{task?.title || t("advanced.noFocusTask")}</h2>
      </div>

      <div className="focus-mode__timer">
        <strong>{formatTime(secondsLeft)}</strong>
        <div className="progress-bar">
          <span style={{width: `${progress}%`}}/>
        </div>
      </div>

      <div className="segmented-control">
        <button type="button" aria-pressed={mode === "focus"} className="segmented-control__item"
                onClick={() => setMode("focus")}>
          {t("advanced.focus25")}
        </button>
        <button type="button" aria-pressed={mode === "break"} className="segmented-control__item"
                onClick={() => setMode("break")}>
          {t("advanced.break5")}
        </button>
      </div>

      <div className="focus-mode__actions">
        <Button icon={running ? <Pause size={16}/> : <Play size={16}/>} onClick={() => setRunning(!running)}>
          {running ? t("music.pause") : t("music.play")}
        </Button>
        <Button icon={<RotateCcw size={16}/>} variant="secondary" onClick={() => setSecondsLeft(modes[mode])}>
          {t("advanced.reset")}
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            onRecord({
              todoId: task?.id || null,
              mode: "focus",
              durationMinutes: 25,
              completedTask: true,
              startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
              completedAt: new Date().toISOString()
            })
          }
        >
          {t("advanced.saveSession")}
        </Button>
      </div>
    </Card>
  );
}

export default FocusMode;
