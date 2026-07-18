import {Music, Pause, Play} from "lucide-react";
import {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import Button from "./Button.jsx";

const notes = [261.63, 329.63, 392.0, 523.25];

function MusicPlayer() {
  const {t} = useTranslation();
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.18);

  const start = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    if (oscillatorsRef.current.length > 0) {
      setPlaying(true);
      return;
    }

    const context = audioContextRef.current || new AudioContext();
    audioContextRef.current = context;
    await context.resume();

    const gain = context.createGain();
    gain.gain.value = volume;
    gain.connect(context.destination);
    gainRef.current = gain;

    oscillatorsRef.current = notes.map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index % 2 ? "triangle" : "sine";
      oscillator.frequency.value = frequency / (index === 3 ? 2 : 1);
      oscillator.connect(gain);
      oscillator.start();
      return oscillator;
    });

    setPlaying(true);
  };

  const stop = () => {
    oscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator?.stop();
      } catch {
        // Ignore oscillator shutdown errors from already stopped nodes.
      }
    });
    oscillatorsRef.current = [];
    gainRef.current?.disconnect();
    gainRef.current = null;
    setPlaying(false);
  };

  const updateVolume = (nextVolume) => {
    const safeVolume = Number.isFinite(nextVolume) ? nextVolume : 0.18;
    setVolume(safeVolume);
    if (gainRef.current) {
      gainRef.current.gain.value = safeVolume;
    }
  };

  return (
    <div className="music-player">
      <Music size={18} aria-hidden="true" />
      <Button
        icon={playing ? <Pause size={16} /> : <Play size={16} />}
        variant="ghost"
        size="sm"
        onClick={playing ? stop : start}
      >
        {playing ? t("music.pause") : t("music.play")}
      </Button>
      <label className="music-player__volume" htmlFor="music-volume">
        <span>{t("music.volume")}</span>
        <input
          id="music-volume"
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={volume}
          onChange={(event) => updateVolume(Number(event.target.value))}
        />
      </label>
    </div>
  );
}

export default MusicPlayer;
