import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamView } from "@/components/exam/ExamView";
import {
  FIRST_LESSON_ID,
  TRACKS,
  finalExamPools,
  getTrack,
  trackExamPool,
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

  // The final draws from every track, so it ships one pool per track and the
  // client samples them; a track exam ships a single pool and shuffles it whole.
  if (trackId === FINAL_EXAM_ID) {
    return (
      <ExamView
        trackId={FINAL_EXAM_ID}
        title={trackTitle(FINAL_EXAM_ID)}
        pools={finalExamPools()}
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
      pools={[trackExamPool(track)]}
      backLessonId={track.lessons[0]?.id ?? FIRST_LESSON_ID}
    />
  );
}
