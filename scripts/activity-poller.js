#!/usr/bin/env node
/**
 * osu! Activity Poller
 * Reads OSU_CLIENT_ID, OSU_CLIENT_SECRET, OSU_USER_ID; fetches recent scores,
 * updates osu/osu-days.json when user played today. Exit 0 if log updated.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "..", "osu", "osu-days.json");
const TOKEN_URL = "https://osu.ppy.sh/oauth/token";
const API_BASE = "https://osu.ppy.sh/api/v2";

async function getToken(clientId, clientSecret) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "public"
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth failed ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function getRecentScores(accessToken, userId) {
  const url = `${API_BASE}/users/${userId}/scores/recent?limit=50`;
  const res = await fetch(url, {
    headers: { "Accept": "application/json", "Authorization": `Bearer ${accessToken}` }
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found or no recent scores");
    const text = await res.text();
    throw new Error(`API failed ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Convert ISO date string to YYYY-MM-DD in the given IANA timezone.
 */
function toDateInTimezone(isoString, timezone) {
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(date);
}

/**
 * Get today's date (YYYY-MM-DD) in the given timezone.
 */
function todayInTimezone(timezone) {
  return toDateInTimezone(new Date().toISOString(), timezone);
}

function readLog() {
  const raw = fs.readFileSync(LOG_PATH, "utf8");
  return JSON.parse(raw);
}

function writeLog(log) {
  log.days.sort();
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + "\n", "utf8");
}

function main() {
  const clientId = process.env.OSU_CLIENT_ID;
  const clientSecret = process.env.OSU_CLIENT_SECRET;
  const userId = process.env.OSU_USER_ID;

  if (!clientId || !clientSecret || !userId) {
    console.error("Missing env: OSU_CLIENT_ID, OSU_CLIENT_SECRET, OSU_USER_ID");
    process.exit(2);
  }

  (async () => {
    const log = readLog();
    const timezone = process.env.TIMEZONE || log.timezone || "America/Los_Angeles";
    const today = todayInTimezone(timezone);

    if (log.days.includes(today)) {
      process.exit(1);
    }

    const token = await getToken(clientId, clientSecret);
    const scores = await getRecentScores(token, userId);

    const playedDates = new Set();
    for (const score of scores) {
      const createdAt = score.created_at;
      if (createdAt) {
        playedDates.add(toDateInTimezone(createdAt, timezone));
      }
    }

    if (!playedDates.has(today)) {
      process.exit(1);
    }

    log.days.push(today);
    writeLog(log);
    process.exit(0);
  })().catch((err) => {
    console.error(err.message || err);
    process.exit(2);
  });
}

main();
