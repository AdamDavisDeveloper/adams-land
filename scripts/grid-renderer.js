#!/usr/bin/env node
/**
 * osu! Grid Renderer
 * Reads osu/osu-days.json, builds a 7×53 (Sun–Sat × weeks) grid for the last 365 days
 * in the log timezone, converts SVG to JPG via sharp. Writes osu/osu-grid.jpg.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_LOG_PATH = path.join(__dirname, "..", "osu", "osu-days.json");
const DEFAULT_OUT_PATH = path.join(__dirname, "..", "osu", "osu-grid.jpg");

const CELL_SIZE = 12;
const GAP = 2;
const PAD = 8;

const COLS = 53;
const ROWS = 7;

/**
 * Get YYYY-MM-DD for a date in the given IANA timezone.
 */
function formatInTimezone(date, timezone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

/**
 * "Today" in timezone as a Date (noon UTC for that local date string).
 */
function getTodayInTimezone(timezone) {
  const now = new Date();
  const todayStr = formatInTimezone(now, timezone);
  return new Date(todayStr + "T12:00:00Z");
}

/**
 * Enumerate the 365 dates (YYYY-MM-DD) for the grid in the log's timezone.
 * Uses the latest date in the log as the grid end when available, so back-filled
 * or past data is visible; otherwise uses today.
 */
function getGridEndDate(log, timezone) {
  const days = log.days || [];
  if (days.length === 0) return getTodayInTimezone(timezone);
  const sorted = [...days].sort();
  const latest = sorted[sorted.length - 1];
  return new Date(latest + "T12:00:00Z");
}

/**
 * Enumerate the 365 dates (YYYY-MM-DD) ending on gridEnd in the log's timezone.
 * Returns array of 365 strings, [0] = oldest, [364] = gridEnd.
 */
function getLast365Dates(timezone, gridEnd) {
  const out = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(gridEnd);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(formatInTimezone(d, timezone));
  }
  return out;
}

function readLog(logPath) {
  const raw = fs.readFileSync(logPath, "utf8");
  return JSON.parse(raw);
}

function buildSvg(playedSet, dates365) {
  const w = PAD * 2 + COLS * (CELL_SIZE + GAP) - GAP;
  const h = PAD * 2 + ROWS * (CELL_SIZE + GAP) - GAP;

  const cells = [];
  cells.push(`<rect width="${w}" height="${h}" fill="#2E3833"/>`);
  for (let i = 0; i < 365; i++) {
    const col = Math.floor(i / 7);
    const row = i % 7;
    const date = dates365[i];
    const played = playedSet.has(date);
    const x = PAD + col * (CELL_SIZE + GAP);
    const y = PAD + row * (CELL_SIZE + GAP);
    const fill = played ? "#39d353" : "#ebedf0";
    cells.push(`<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" fill="${fill}" rx="1"/>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${cells.join("\n")}
</svg>`;
}

async function main() {
  const logPath = process.argv[2] || DEFAULT_LOG_PATH;
  const outPath = process.argv[3] || DEFAULT_OUT_PATH;

  const log = readLog(logPath);
  const timezone = log.timezone || "America/Los_Angeles";
  const gridEnd = getGridEndDate(log, timezone);
  const playedSet = new Set(log.days || []);
  const dates365 = getLast365Dates(timezone, gridEnd);

  const svg = buildSvg(playedSet, dates365);

  const sharp = require("sharp");
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outPath);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
