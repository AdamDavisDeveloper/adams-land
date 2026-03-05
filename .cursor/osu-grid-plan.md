# osu! Play Activity Tracker – Build Plan

## Overview

This project creates an automated system that tracks whether the user has played **osu!** on a given day and generates a **GitHub-style contribution grid image** representing daily activity.

The image will be generated as an **SVG heatmap**, converted to **JPG**, and automatically committed to the website repository so that Netlify deploys the updated image.

The system will run automatically using **GitHub Actions on an hourly schedule**.

The final image will live at a stable URL such as:

`/osu/osu-grid.jpg`

This allows the image to be embedded anywhere (including the osu! profile "me!" section) while automatically updating when new activity is detected.

---

# System Architecture

The system consists of four main components:

1. **Activity Poller**
2. **Persistent Play Log**
3. **Grid Renderer**
4. **Automated Deployment**

Each component runs as part of a GitHub Actions workflow.

---

# Component 1 – Activity Poller

## Purpose

Determine whether the user has played osu! on the current day.

## Data Source

The system queries the **osu! API v2** to retrieve the user's **recent scores**.

The API response contains timestamps indicating when each score ended.

These timestamps are used to determine whether a play occurred today.

## Logic

The poller performs the following steps:

1. Authenticate with the osu! API using a client credentials OAuth token.
2. Request the user's recent scores.
3. Examine the timestamps of the returned plays.
4. Convert the timestamps to the configured timezone.
5. Determine whether any plays occurred on the current calendar day.

If a play occurred today, the system proceeds to update the persistent play log.

If not, the workflow exits without modifying any data.

---

# Component 2 – Persistent Play Log

## Purpose

Maintain a record of every day that osu! was played.

This allows generation of a historical activity grid.

## Storage Format

The play log is stored as a JSON file within the website repository.

Example file location:

`/osu/osu-days.json`

## Data Structure

The JSON file contains:

* the timezone used for interpreting play timestamps
* a list of dates representing days on which osu! was played

Each entry represents a single calendar day.

Dates are stored in ISO format:

`YYYY-MM-DD`

The file grows over time as additional play days are detected.

## Update Rules

When the poller detects activity today:

1. Load the JSON file.
2. Check whether today's date already exists.
3. If not present, append the date.
4. Save the updated JSON.

This ensures the system remains **idempotent** and avoids duplicate entries.

---

# Component 3 – Activity Grid Renderer

## Purpose

Generate a **GitHub-style contributions heatmap** representing daily osu! activity.

The renderer reads the play log and produces a visual grid.

## Rendering Strategy

The grid is generated as an **SVG image**.

SVG is used because:

* it is easy to programmatically construct
* layout of rectangular tiles is simple
* it converts cleanly to JPG

The SVG is then converted into a final **JPG image** for hosting.

## Grid Layout

The layout mimics GitHub’s contribution graph:

* **7 rows** representing days of the week
* **52–53 columns** representing weeks
* each cell represents one calendar day

Cells are filled based on play activity.

### Tile Colors

Two states are required:

Played day
Unplayed day

Played days are rendered using a green color.

Unplayed days are rendered using a neutral gray color.

Future expansion could support intensity levels (multiple greens) based on play count, but the initial design uses a binary state.

## Time Range

The grid represents the **most recent 365 days**.

Older entries in the log may be retained but are ignored during rendering.

## Output File

The renderer produces:

`/osu/osu-grid.jpg`

This file replaces the previous image each time it is regenerated.

---

# Component 4 – Automated Deployment

## Purpose

Automatically run the system on a schedule and publish updates.

## Platform

GitHub Actions is used as the automation engine.

The workflow runs within the same repository that Netlify deploys.

When the generated files are committed, Netlify automatically redeploys the site.

## Schedule

The workflow runs **once per hour**.

Hourly polling ensures that activity is detected soon after it occurs without excessive API usage.

## Workflow Behavior

Each scheduled run performs the following steps:

1. Start the GitHub Actions workflow.
2. Request an osu! API token.
3. Query the user's recent scores.
4. Check if a play occurred today.
5. If no play occurred today, exit.
6. If a play occurred today:

   * update the JSON log
   * regenerate the SVG grid
   * convert SVG to JPG
   * overwrite the image file
7. Commit the updated files to the repository.
8. Push the commit to the main branch.
9. Netlify automatically deploys the new version.

---

# Repository File Structure

Suggested structure inside the site repository:

```
/osu
  osu-days.json
  osu-grid.jpg
/scripts
  activity-poller
  grid-renderer
.github
  workflows
    osu-tracker-workflow
```

Descriptions:

* **osu-days.json**
  persistent play history

* **osu-grid.jpg**
  generated heatmap image

* **scripts/**
  scripts responsible for polling the API and generating the grid

* **workflow file**
  scheduled automation configuration

---

# Authentication

The osu! API requires OAuth authentication.

The project uses the **client credentials grant** flow.

Secrets required:

* osu client id
* osu client secret

These values are stored in **GitHub repository secrets** and accessed by the workflow at runtime.

---

# Idempotency

The system must behave safely if the workflow runs multiple times per day.

The JSON log is only modified when:

* today's date exists in the API results
* today's date does not already exist in the log

This prevents duplicate entries and unnecessary commits.

---

# Future Extensions

Possible improvements that can be added later:

### Play Intensity Levels

Instead of a binary tile, tiles could represent play count tiers such as:

* 1 play
* 5 plays
* 10 plays
* 20+ plays

### Additional Statistics

The log could also store:

* number of plays per day
* total score count
* playtime estimates

### Streak Tracking

A secondary system could compute:

* longest streak
* current streak
* total active days

### Multiple Game Modes

Activity tracking could optionally be separated by:

* osu!standard
* taiko
* catch
* mania

---

# Result

Once deployed, the system will automatically:

* detect when osu! is played
* record the day in a persistent log
* generate a GitHub-style contribution grid
* update the image hosted on the website
* deploy changes through Netlify

The image can then be embedded anywhere using a stable URL.

The system requires no manual interaction once configured.

