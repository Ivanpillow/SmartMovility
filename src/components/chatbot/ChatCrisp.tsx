"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

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

    Crisp.setPosition("left");

    Crisp.setColorTheme("blue");

    Crisp.chat.show();

    crispConfigured = true;
  }, []);

  return null;
}