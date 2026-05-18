"use client";

import { useEffect } from "react";
import { ChatboxColors, ChatboxPosition, Crisp } from "crisp-sdk-web";

let crispConfigured = false;

export function CrispChat() {
  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

    if (!websiteId) {
      console.error("Falta NEXT_PUBLIC_CRISP_WEBSITE_ID");
      return;
    }

    if (crispConfigured) return;

    Crisp.configure(websiteId);

    // Reset the chat session on each full page load (refresh).
    Crisp.session.reset();

    Crisp.setPosition(ChatboxPosition.Left);

    Crisp.setColorTheme(ChatboxColors.Blue);

    Crisp.chat.show();

    crispConfigured = true;
  }, []);

  return null;
}