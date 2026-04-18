(function () {
  "use strict";

  /**
   * AdamsLand TV: loads a JSON playlist, proves the first chosen clip is reachable,
   * then drives Plyr behind a simple "curtains" animation on the screen chrome.
   */

  const CURTAIN_TRANSITION_MS = 500;

  const dom = {
    status: document.getElementById("tv-api-status"),
    nowPlaying: document.getElementById("tv-now-playing"),
    player: document.getElementById("player"),
    screenInner: document.getElementById("tv-screen-inner"),
    btnStart: document.getElementById("tv-btn-start"),
    btnSkip: document.getElementById("tv-btn-skip"),
    btnOff: document.getElementById("tv-btn-off")
  };

  const playback = {
    /** @type {{ url: string, title?: string }[]} */
    videos: [],
    currentIndex: 0,
    /** @type {Plyr | null} */
    plyr: null
  };

  const curtain = {
    /** True while the visual curtains cover the video (initial HTML class + after Off). */
    isClosed: true,
    /** True while we are waiting for the curtain CSS transition to finish. */
    isAnimating: false,
    settleTimerId: null
  };

  let transportButtonsWired = false;

  function renderStatusLines(lines) {
    if (!dom.status) {
      return;
    }
    dom.status.textContent = lines.join("\n");
  }

  function clearStatus() {
    renderStatusLines([]);
  }

  function clearNowPlayingDisplay() {
    if (!dom.nowPlaying) {
      return;
    }
    dom.nowPlaying.textContent = "";
  }

  /**
   * The "Now playing" line is only for when the set is visibly on (curtains open).
   * While off, the element stays empty so nothing leaks before the user presses Start.
   */
  function syncNowPlayingWithTvPowerState() {
    if (!dom.nowPlaying) {
      return;
    }
    if (curtain.isClosed) {
      dom.nowPlaying.textContent = "";
      return;
    }
    const clip = playback.videos[playback.currentIndex];
    const title = clip && clip.title ? clip.title : "";
    dom.nowPlaying.textContent = title ? "Now playing: " + title : "";
  }

  function clearNowPlaying() {
    clearNowPlayingDisplay();
  }

  function pickRandomIndexInRange(count) {
    if (count <= 1) {
      return 0;
    }
    return Math.floor(Math.random() * count);
  }

  function pickRandomIndexDifferentFrom(count, excludeIndex) {
    if (count <= 1) {
      return 0;
    }
    let candidate;
    do {
      candidate = Math.floor(Math.random() * count);
    } while (candidate === excludeIndex);
    return candidate;
  }

  function isNonEmptyString(value) {
    return typeof value === "string" && value.length > 0;
  }

  function playlistEntryHasPlayableUrl(entry) {
    return Boolean(entry) && isNonEmptyString(entry.url);
  }

  function cancelCurtainSettleTimer() {
    if (curtain.settleTimerId == null) {
      return;
    }
    window.clearTimeout(curtain.settleTimerId);
    curtain.settleTimerId = null;
  }

  function afterCurtainAnimationFinishes(work) {
    cancelCurtainSettleTimer();
    curtain.settleTimerId = window.setTimeout(function () {
      curtain.settleTimerId = null;
      work();
    }, CURTAIN_TRANSITION_MS);
  }

  function setCurtainsVisuallyClosed(shouldClose) {
    if (!dom.screenInner) {
      return;
    }
    if (shouldClose) {
      dom.screenInner.classList.add("tv-screen-inner--curtains-closed");
      return;
    }
    dom.screenInner.classList.remove("tv-screen-inner--curtains-closed");
  }

  function loadTrackAtIndex(index, shouldAutoplay) {
    if (!playback.plyr || playback.videos.length === 0) {
      return;
    }
    const clip = playback.videos[index];
    if (!playlistEntryHasPlayableUrl(clip)) {
      return;
    }

    playback.currentIndex = index;
    playback.plyr.source = {
      type: "video",
      sources: [{ src: clip.url, type: "video/mp4" }]
    };

    if (clip.title && dom.player) {
      dom.player.setAttribute("data-playlist-title", clip.title);
    }

    syncNowPlayingWithTvPowerState();

    if (shouldAutoplay) {
      void playback.plyr.play().catch(function () {});
    }
  }

  function jumpToRandomTrackWithoutPlaying() {
    const count = playback.videos.length;
    if (count === 0) {
      return;
    }
    loadTrackAtIndex(pickRandomIndexInRange(count), false);
  }

  function onVideoEndedAdvancePlaylist() {
    const count = playback.videos.length;
    if (count === 0 || curtain.isClosed) {
      return;
    }
    const nextIndex = pickRandomIndexDifferentFrom(count, playback.currentIndex);
    loadTrackAtIndex(nextIndex, true);
  }

  function ensurePlyrExists() {
    if (playback.plyr) {
      return;
    }
    playback.plyr = new Plyr("#player", {
      controls: [],
      clickToPlay: false,
      keyboard: false,
      tooltips: { controls: false, seek: false }
    });
    playback.plyr.on("ended", onVideoEndedAdvancePlaylist);
  }

  function wireTransportButtonsOnce() {
    if (transportButtonsWired) {
      return;
    }
    transportButtonsWired = true;

    if (dom.btnStart) {
      dom.btnStart.addEventListener("click", onStartOrResumeClick);
    }
    if (dom.btnSkip) {
      dom.btnSkip.addEventListener("click", onSkipClick);
    }
    if (dom.btnOff) {
      dom.btnOff.addEventListener("click", onPowerOffClick);
    }
  }

  function onPowerOffClick() {
    if (!playback.plyr || !dom.screenInner || curtain.isAnimating) {
      return;
    }

    if (curtain.isClosed) {
      jumpToRandomTrackWithoutPlaying();
      return;
    }

    clearNowPlayingDisplay();
    curtain.isAnimating = true;
    cancelCurtainSettleTimer();
    setCurtainsVisuallyClosed(true);

    afterCurtainAnimationFinishes(function () {
      playback.plyr.pause();
      curtain.isClosed = true;
      jumpToRandomTrackWithoutPlaying();
      curtain.isAnimating = false;
    });
  }

  function onStartOrResumeClick() {
    if (!playback.plyr || !dom.screenInner || curtain.isAnimating) {
      return;
    }

    if (curtain.isClosed) {
      curtain.isAnimating = true;
      cancelCurtainSettleTimer();
      setCurtainsVisuallyClosed(false);
      void playback.plyr.play().catch(function () {});

      afterCurtainAnimationFinishes(function () {
        curtain.isClosed = false;
        curtain.isAnimating = false;
        syncNowPlayingWithTvPowerState();
      });
      return;
    }

    void playback.plyr.play().catch(function () {});
  }

  function onSkipClick() {
    if (!playback.plyr || curtain.isClosed || curtain.isAnimating) {
      return;
    }
    const count = playback.videos.length;
    if (count === 0) {
      return;
    }
    const nextIndex = pickRandomIndexDifferentFrom(count, playback.currentIndex);
    loadTrackAtIndex(nextIndex, true);
  }

  async function fetchPlaylistJson() {
    const response = await fetch("./playlist.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("playlist fetch failed");
    }
    return response.json();
  }

  function readVideosArrayFromPlaylistPayload(playlist) {
    return Array.isArray(playlist.videos) ? playlist.videos : [];
  }

  function exposePlaylistOnWindowForDebugging(playlist) {
    window.__ADAMSLAND_TV_PLAYLIST = playlist;
  }

  async function probeMediaUrlWithRangeRequest(url) {
    return fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      mode: "cors"
    });
  }

  function isSuccessfulRangeProbe(response) {
    return response.ok || response.status === 206;
  }

  function hintForFailedMediaProbe(response) {
    if (response.status === 404) {
      return (
        "Hint: 404 from GCS is usually NoSuchKey — the URL path must match the object key exactly."
      );
    }
    return null;
  }

  /**
   * Confirms the browser can fetch the clip (CORS + object exists). On failure, optional
   * troubleshooting lines are appended to `statusLines` before throwing, so the UI can
   * show both the hint and the final error message (same behavior as the original script).
   */
  async function verifyPlaylistEntryIsReachable(clip, statusLines) {
    if (!playlistEntryHasPlayableUrl(clip)) {
      throw new Error("playlist entry missing url");
    }

    const mediaResponse = await probeMediaUrlWithRangeRequest(clip.url);
    if (isSuccessfulRangeProbe(mediaResponse)) {
      return;
    }

    const hint = hintForFailedMediaProbe(mediaResponse);
    if (hint) {
      statusLines.push(hint);
    }
    throw new Error("unexpected media response status");
  }

  function formatCaughtError(err) {
    if (err && err.message) {
      return err.message;
    }
    return String(err);
  }

  async function init() {
    const statusLines = [];

    try {
      const playlist = await fetchPlaylistJson();
      const videos = readVideosArrayFromPlaylistPayload(playlist);

      if (videos.length === 0) {
        throw new Error("playlist.videos is empty");
      }

      exposePlaylistOnWindowForDebugging(playlist);

      const startIndex = pickRandomIndexInRange(videos.length);
      const clipWeWillLoadFirst = videos[startIndex];
      await verifyPlaylistEntryIsReachable(clipWeWillLoadFirst, statusLines);

      playback.videos = videos;
      ensurePlyrExists();
      wireTransportButtonsOnce();
      loadTrackAtIndex(startIndex, false);
      clearStatus();
    } catch (err) {
      statusLines.push("Error: " + formatCaughtError(err));
      renderStatusLines(statusLines);
      clearNowPlaying();
    }
  }

  init();
})();