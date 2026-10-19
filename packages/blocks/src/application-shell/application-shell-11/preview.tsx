import {
  HouseIcon,
  LibraryIcon,
  MusicIcon,
  PlayIcon,
  RadioIcon,
  VideoIcon,
} from "@kamod-ch/icons/lucide";
import { Badge, Button } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import kamodLogoUrl from "../application-shell-1/assets/kamod-ui-logo.svg?url";
import { ApplicationShell11 } from "./application-shell-11";

const videos = [
  {
    title: "Building a calmer workspace",
    channel: "Studio Notes",
    category: "Design",
    duration: "12:08",
  },
  {
    title: "A tiny component, a better interface",
    channel: "Kamod Sessions",
    category: "Development",
    duration: "08:42",
  },
  {
    title: "Sound for a focused afternoon",
    channel: "Field Recordings",
    category: "Music",
    duration: "24:16",
  },
  {
    title: "From first draft to useful prototype",
    channel: "Studio Notes",
    category: "Design",
    duration: "16:35",
  },
  {
    title: "State that stays close to the UI",
    channel: "Kamod Sessions",
    category: "Development",
    duration: "10:21",
  },
  {
    title: "An evening outside the city",
    channel: "Field Recordings",
    category: "Music",
    duration: "18:04",
  },
];

/** Search/category/channel filtering and a local selection without invented playback. */
export function ApplicationShell11Preview() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [path, setPath] = useState("/home");
  const [selected, setSelected] = useState("");
  const [notice, setNotice] = useState("Choose a video to inspect its details.");
  const visible = videos.filter(
    (video) =>
      (category === "All" || video.category === category) &&
      `${video.title} ${video.channel}`.toLowerCase().includes(query.toLowerCase()) &&
      (!path.startsWith("/channel/") || video.channel === path.slice(9)),
  );
  return (
    <ApplicationShell11
      brand={{ name: "Kamod Watch", logo: <img src={kamodLogoUrl} alt="" /> }}
      user={{ name: "Alex Morgan", email: "alex@example.com" }}
      breadcrumbs={[
        { label: "Watch" },
        { label: path.startsWith("/channel/") ? path.slice(9) : "Discover" },
      ]}
      navigationGroups={[
        {
          id: "watch",
          items: [
            { id: "home", label: "Home", href: "/home", icon: HouseIcon },
            { id: "shorts", label: "Short sessions", href: "/shorts", icon: VideoIcon },
            { id: "library", label: "Library", href: "/library", icon: LibraryIcon },
          ],
        },
        {
          id: "explore",
          label: "Explore",
          items: [
            { id: "music", label: "Music", icon: MusicIcon },
            { id: "development", label: "Development", icon: RadioIcon },
          ],
        },
      ]}
      subscriptions={Array.from(new Set(videos.map((video) => video.channel))).map((name) => ({
        id: name,
        label: name,
        href: `/channel/${name}`,
      }))}
      currentPath={path}
      searchQuery={query}
      onSearchQueryChange={setQuery}
      onSearch={(value) =>
        setNotice(value ? `Showing matches for “${value}”.` : "Showing all matching videos.")
      }
      onNavigate={(destination, event) => {
        event.preventDefault();
        if (destination.href) {
          setPath(destination.href);
          setCategory("All");
        } else setCategory(destination.label);
        setSelected("");
        setNotice(`${destination.label} selected.`);
      }}
      onUserAction={(action) => setNotice(`${action} selected; connect your account service.`)}
    >
      <div class="space-y-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Your next good idea
            </p>
            <h1 class="text-2xl font-semibold">
              {path.startsWith("/channel/") ? path.slice(9) : "Discover something useful"}
            </h1>
          </div>
          <Badge variant="outline">{visible.length} sessions</Badge>
        </div>
        <nav aria-label="Video categories" class="flex flex-wrap gap-2">
          {["All", "Design", "Development", "Music"].map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "secondary" : "ghost"}
              aria-pressed={category === item}
              onClick={() => {
                setCategory(item);
                setSelected("");
              }}
            >
              {item}
            </Button>
          ))}
        </nav>
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((video, index) => (
            <button
              key={video.title}
              type="button"
              aria-pressed={selected === video.title}
              onClick={() => {
                setSelected(video.title);
                setNotice(
                  `${video.title} selected. This preview shows metadata, not a video player.`,
                );
              }}
              class="min-w-0 space-y-3 text-left focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span
                class={`relative flex aspect-video items-center justify-center rounded-xl border ${selected === video.title ? "bg-primary/15 text-primary" : index % 2 ? "bg-secondary/10 text-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <PlayIcon size={30} strokeWidth={1.5} aria-hidden="true" />
                <span class="absolute right-2 bottom-2 rounded bg-background/90 px-2 py-1 text-[10px] text-foreground">
                  {video.duration}
                </span>
              </span>
              <span class="block font-medium">{video.title}</span>
              <span class="block text-xs text-muted-foreground">
                {video.channel} · {video.category}
              </span>
            </button>
          ))}
        </div>
        {!visible.length && (
          <div class="rounded-xl border p-6">
            <h2 class="font-medium">No matching sessions</h2>
            <p class="mt-2 text-sm text-muted-foreground">Try another query or choose All.</p>
            <Button
              variant="outline"
              size="sm"
              class="mt-4"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setPath("/home");
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
        <p role="status" class="border-t pt-4 text-xs text-muted-foreground">
          {notice}
        </p>
      </div>
    </ApplicationShell11>
  );
}
