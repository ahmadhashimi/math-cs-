import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import {
  COURSE_STATS,
  FIRST_LESSON_ID,
  TRACKS,
  threadViews,
} from "@/lib/course";

export const metadata: Metadata = { title: "Math for a CS Degree" };

export default function Page() {
  // The home page only needs each track's identity and its lesson ids — the
  // lesson bodies would be the entire course serialised into the RSC payload
  // for a page that never renders a word of them.
  const tracks = TRACKS.map((track) => ({
    id: track.id,
    n: track.n,
    sub: track.sub,
    lessonIds: track.lessons.map((lesson) => lesson.id),
  }));

  return (
    <HomeView
      stats={COURSE_STATS}
      tracks={tracks}
      threads={threadViews()}
      firstLessonId={FIRST_LESSON_ID}
    />
  );
}
