// Hängt an alle eigenen CSS/JS-Links in index.html eine Version (?v=...),
// damit Browser nach jedem Update die neuen Dateien laden statt alter Kopien.
// Aufruf vor dem Commit: node scripts/version.mjs
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../index.html", import.meta.url);
const v = new Date().toISOString().replace(/\D/g, "").slice(0, 12);
const html = readFileSync(file, "utf8").replace(
  /((?:href|src)="(?!https?:|\/\/)[^"?]+\.(?:css|js))(?:\?v=\w+)?"/g,
  `$1?v=${v}"`,
);
writeFileSync(file, html);
console.log(`Version ${v} gesetzt`);
