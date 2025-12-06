const ALLOW_DEFAULT =
  "autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;";

type VideoEmbed = {
  src: string;
  allow?: string;
  title?: string;
};

const extractYoutubeId = (url: URL) => {
  if (url.hostname.includes("youtube.com")) {
    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2] ?? null;
    }
    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/")[2] ?? null;
    }
    return url.searchParams.get("v");
  }

  if (url.hostname === "youtu.be") {
    const [, videoId] = url.pathname.split("/");
    return videoId || null;
  }

  return null;
};

const extractKinescopeId = (url: URL) => {
  if (!url.hostname.includes("kinescope.io")) {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (!segments.length) {
    return null;
  }

  return segments[segments.length - 1];
};

export const getVideoEmbed = (rawUrl?: string | null): VideoEmbed | null => {
  if (!rawUrl) {
    return null;
  }

  try {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    const ytId = extractYoutubeId(parsed);
    if (ytId) {
      return {
        src: `https://www.youtube.com/embed/${ytId}`,
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
        title: "YouTube video player",
      };
    }

    if (host.includes("kinescope.io")) {
      const videoId = extractKinescopeId(parsed);
      if (videoId) {
        return {
          src: `https://kinescope.io/embed/${videoId}`,
          allow: ALLOW_DEFAULT,
          title: "Kinescope video player",
        };
      }
    }

    return {
      src: parsed.toString(),
      allow: ALLOW_DEFAULT,
      title: "Video player",
    };
  } catch {
    return null;
  }
};



