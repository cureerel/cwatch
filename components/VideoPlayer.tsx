"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  X,
  Keyboard,
} from "lucide-react";


interface VideoPlayerProps {
  src: string;
  title?: string;
  onClose?: () => void;
}

interface Toast {
  id: number;
  message: string;
  icon: string;
}

export function VideoPlayer({ src, title, onClose }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(100);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const toastId = useRef(0);

  // ── Bounce prevention ────────────────────────────────────────────────────
  // Strategy: intercept navigation at the browser level without sandbox
  // (sandbox breaks the player's internal DRM/script requirements)
  useEffect(() => {
    // 1. Push a history entry so back button fires popstate instead of leaving
    window.history.pushState({ cwatch: true }, "", window.location.href);

    const handlePopState = () => {
      // Re-push immediately so the page never actually navigates back
      window.history.pushState({ cwatch: true }, "", window.location.href);
    };

    // 2. Block beforeunload — fires when iframe tries window.top.location redirect
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    // 3. Override click on iframe container — ads often use a transparent
    //    anchor over the entire player. We catch focus loss as a proxy.
    const handleBlur = () => {
      // If the iframe just stole focus (user clicked inside it),
      // schedule a refocus back to the wrapper so keyboard shortcuts keep working
      setTimeout(() => {
        if (document.activeElement === iframeRef.current) {
          wrapperRef.current?.focus();
        }
      }, 100);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload, {
      capture: true,
    });
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload, {
        capture: true,
      });
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, icon: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1600);
  }, []);

  // ── postMessage to iframe (best-effort) ──────────────────────────────────
  const sendToFrame = useCallback((data: Record<string, unknown>) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify(data), "*");
    } catch {
      // cross-origin blocks are expected — UI feedback still shows
    }
  }, []);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      switch (e.key.toLowerCase()) {
        case "j":
          e.preventDefault();
          sendToFrame({ type: "seek", offset: -10 });
          showToast("−10 seconds", "⏪");
          break;

        case "l":
          e.preventDefault();
          sendToFrame({ type: "seek", offset: 10 });
          showToast("+10 seconds", "⏩");
          break;

        case "k":
        case " ":
          e.preventDefault();
          setPaused((prev) => {
            const next = !prev;
            sendToFrame({ type: next ? "pause" : "play" });
            showToast(next ? "Paused" : "Playing", next ? "⏸" : "▶️");
            return next;
          });
          break;

        case "m":
          e.preventDefault();
          setMuted((prev) => {
            const next = !prev;
            sendToFrame({ type: "mute", value: next });
            showToast(next ? "Muted" : "Unmuted", next ? "🔇" : "🔊");
            return next;
          });
          break;

        case "u":
          e.preventDefault();
          setVolume((prev) => {
            const next = Math.min(100, prev + 10);
            sendToFrame({ type: "volume", value: next / 100 });
            showToast(`Volume ${next}%`, "🔊");
            return next;
          });
          break;

        case "d":
          e.preventDefault();
          setVolume((prev) => {
            const next = Math.max(0, prev - 10);
            sendToFrame({ type: "volume", value: next / 100 });
            showToast(`Volume ${next}%`, next === 0 ? "🔇" : "🔉");
            return next;
          });
          break;

        case "x":
        case "escape":
          e.preventDefault();
          onClose?.();
          break;

        case "?":
          e.preventDefault();
          setShowShortcuts((prev) => !prev);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sendToFrame, showToast, onClose]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full bg-black group outline-none"
      style={{ aspectRatio: "16/9", maxHeight: "70vh" }}
      tabIndex={0}
    >
      {/* ── Iframe — NO sandbox so player works fully ── */}
      <iframe
        ref={iframeRef}
        src={src}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="no-referrer"
        title={title ?? "Video Player"}
      />

      {/* ── Transparent click-guard layer ──────────────────────────────────
          Covers only the corners/edges where ad overlays typically sit.
          The center 80% is left open so the player controls are clickable. ── */}
      <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-3 grid-rows-3">
        {/* top-left corner guard */}
        <div
          className="pointer-events-auto"
          onClick={(e) => e.preventDefault()}
        />
        {/* top-center: let through */}
        <div className="pointer-events-none" />
        {/* top-right corner guard */}
        <div
          className="pointer-events-auto"
          onClick={(e) => e.preventDefault()}
        />
        {/* middle row: all let through */}
        <div className="pointer-events-none col-span-3" />
        {/* bottom-left */}
        <div
          className="pointer-events-auto"
          onClick={(e) => e.preventDefault()}
        />
        {/* bottom-center */}
        <div className="pointer-events-none" />
        {/* bottom-right */}
        <div
          className="pointer-events-auto"
          onClick={(e) => e.preventDefault()}
        />
      </div>

      {/* ── Close button ── */}
      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-colors opacity-0 group-hover:opacity-100 duration-200"
          aria-label="Close player"
          title="Close (X / Esc)"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* ── Shortcuts toggle ── */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowShortcuts((v) => !v);
        }}
        className="absolute top-3 left-3 z-20 h-8 w-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-colors opacity-0 group-hover:opacity-100 duration-200"
        aria-label="Keyboard shortcuts"
        title="Shortcuts (?)"
      >
        <Keyboard className="h-3.5 w-3.5" />
      </button>

      {/* ── Bottom control bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPaused((p) => {
                const next = !p;
                sendToFrame({ type: next ? "pause" : "play" });
                showToast(next ? "Paused" : "Playing", next ? "⏸" : "▶️");
                return next;
              });
            }}
            className="text-white hover:text-white/70 transition-colors"
            title={paused ? "Play (K)" : "Pause (K)"}
          >
            {paused ? (
              <Play className="h-4 w-4 fill-white" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sendToFrame({ type: "seek", offset: -10 });
              showToast("−10 seconds", "⏪");
            }}
            className="text-white hover:text-white/70 transition-colors"
            title="Back 10s (J)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sendToFrame({ type: "seek", offset: 10 });
              showToast("+10 seconds", "⏩");
            }}
            className="text-white hover:text-white/70 transition-colors"
            title="Forward 10s (L)"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => {
                const next = !m;
                sendToFrame({ type: "mute", value: next });
                showToast(next ? "Muted" : "Unmuted", next ? "🔇" : "🔊");
                return next;
              });
            }}
            className="text-white hover:text-white/70 transition-colors"
            title={muted ? "Unmute (M)" : "Mute (M)"}
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          <span className="text-white/50 text-xs tabular-nums">{volume}%</span>
        </div>

        <div className="flex-1" />

        {/* Key hints */}
        <div className="hidden sm:flex items-center gap-2.5 pointer-events-none">
          {[
            { k: "J", tip: "−10s" },
            { k: "K", tip: "Play/Pause" },
            { k: "L", tip: "+10s" },
            { k: "M", tip: "Mute" },
            { k: "U", tip: "Vol+" },
            { k: "D", tip: "Vol−" },
            { k: "X", tip: "Close" },
          ].map(({ k, tip }) => (
            <kbd
              key={k}
              title={tip}
              className="font-mono text-[10px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded border border-white/10"
            >
              {k}
            </kbd>
          ))}
        </div>
      </div>

      {/* ── Toast notifications ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-2 bg-black/80 backdrop-blur-md text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-2xl"
            style={{ animation: "fadeInScale 0.15s ease forwards" }}
          >
            <span className="text-lg leading-none">{toast.icon}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ── Shortcuts panel ── */}
      {showShortcuts && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowShortcuts(false);
          }}
        >
          <div
            className="bg-card border border-border rounded-2xl p-6 w-80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl tracking-wider uppercase text-foreground">
                Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { key: "J", desc: "Back 10 seconds" },
                { key: "K", desc: "Play / Pause" },
                { key: "Space", desc: "Play / Pause" },
                { key: "L", desc: "Forward 10 seconds" },
                { key: "M", desc: "Toggle mute" },
                { key: "U", desc: "Volume up 10%" },
                { key: "D", desc: "Volume down 10%" },
                { key: "X", desc: "Close player" },
                { key: "Esc", desc: "Close player" },
                { key: "?", desc: "Toggle shortcuts" },
              ].map(({ key, desc }) => (
                <div
                  key={key + desc}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-muted-foreground text-sm">{desc}</span>
                  <kbd className="font-mono text-xs bg-muted border border-border text-foreground px-2.5 py-1 rounded shrink-0">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
