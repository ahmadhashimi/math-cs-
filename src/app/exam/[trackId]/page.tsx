import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamView } from "@/components/exam/ExamView";
import {
  FIRST_LESSON_ID,
  TRACKS,
  examPrompts,
  getTrack,
  trackTitle,
} from "@/lib/course";
import { FINAL_EXAM_ID } from "@/lib/types";

type Params = { params: Promise<{ trackId: string }> };

export async function generateStaticParams() {
  return [
    ...TRACKS.map((track) => ({ trackId: track.id })),
    { trackId: FINAL_EXAM_ID },
  ];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { trackId } = await params;
  if (trackId !== FINAL_EXAM_ID && !getTrack(trackId)) {
    return { title: "Exam not found · Math for a CS Degree" };
  }
  return { title: `${trackTitle(trackId)} exam · Math for a CS Degree` };
}

export default async function ExamPage({ params }: Params) {
  const { trackId } = await params;

  // Both shapes ship PROMPTS — question and options, no answer and no
  // explanation. The final draws from every track, so it sends one pool per
  // track and the client samples them; a track exam sends a single pool and
  // shuffles it whole. Neither carries anything worth reading in the source.
  if (trackId === FINAL_EXAM_ID) {
    return (
      <ExamView
        trackId={FINAL_EXAM_ID}
        title={trackTitle(FINAL_EXAM_ID)}
        pools={examPrompts(FINAL_EXAM_ID)}
        backLessonId={FIRST_LESSON_ID}
      />
    );
  }

  const track = getTrack(trackId);
  if (!track) notFound();

  return (
    <ExamView
      trackId={track.id}
      title={track.n}
      pools={examPrompts(track.id)}
      backLessonId={track.lessons[0]?.id ?? FIRST_LESSON_ID}
    />
  );
}
