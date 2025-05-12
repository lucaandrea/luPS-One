export const appIds = [
  // Original ryOS apps
  "finder",
  "soundboard",
  "internet-explorer",
  "chats",
  "textedit",
  "paint",
  "photo-booth",
  "minesweeper",
  "videos",
  "ipod",
  "synth",
  "pc",
  "terminal",
  "control-panels",

  // luPS-One PlayStation slots
  "gran-turismo",
  "fifa",
  "metal-gear",
  "need-for-speed",
  "parappa",
  "driver",
  "demo-disc",
  "empty"
] as const;

export type AppId = typeof appIds[number]; 