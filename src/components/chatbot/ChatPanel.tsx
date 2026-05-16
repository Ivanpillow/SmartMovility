"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/** ID configurado en Botpress > Webchat > Deploy Settings > Embedded */
export const BOTPRESS_EMBED_CONTAINER_ID = "bp-embedded-chat-smartMV";

const BOTPRESS_INJECT_SCRIPT =
  "https://cdn.botpress.cloud/webchat/v3.6/inject.js";
const BOTPRESS_CONFIG_SCRIPT =
  "https://files.bpcontent.cloud/2026/05/14/03/20260514032827-280YJ0G3.js";
      
function containBotpressLayout(container: HTMLElement) {
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.overflow = "hidden";
  container.style.isolation = "isolate";

  const descendants = container.querySelectorAll<HTMLElement>("*");
  descendants.forEach((element) => {
    const computed = window.getComputedStyle(element);

    if (computed.position === "fixed") {
      element.style.position = "absolute";
    }

    const zIndex = Number.parseInt(computed.zIndex, 10);
    if (Number.isFinite(zIndex) && zIndex > 50) {
      element.style.zIndex = "1";
    }

    if (element.tagName === "IFRAME") {
      element.style.position = "absolute";
      element.style.inset = "0";
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.maxHeight = "none";
      element.style.border = "0";
      element.style.borderRadius = "0";
    }
  });
}

export function ChatPanel() {
  const [injectReady, setInjectReady] = useState(false);

  useEffect(() => {
    if (!injectReady) return;

    const container = document.getElementById(BOTPRESS_EMBED_CONTAINER_ID);
    if (!container) return;

    containBotpressLayout(container);

    const observer = new MutationObserver(() => containBotpressLayout(container));
    observer.observe(container, { childList: true, subtree: true, attributes: true });

    const interval = window.setInterval(() => containBotpressLayout(container), 500);
    const stopInterval = window.setTimeout(() => window.clearInterval(interval), 8000);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(stopInterval);
    };
  }, [injectReady]);

  return (
    <div className="smartmovility-chat-shell absolute inset-0 flex flex-col bg-background">
      <div
        id={BOTPRESS_EMBED_CONTAINER_ID}
        className="botpress-embedded-chat relative flex-1 min-h-0 w-full"
        aria-label="Chat con el asistente SmartMovility"
      />

      <Script
        id="botpress-webchat-inject"
        src={BOTPRESS_INJECT_SCRIPT}
        strategy="afterInteractive"
        onLoad={() => setInjectReady(true)}
      />
      {injectReady && (
        <Script
          id="botpress-webchat-config"
          src={BOTPRESS_CONFIG_SCRIPT}
          strategy="afterInteractive"
        />
      )}
    </div>
  );
}
