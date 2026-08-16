import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/lesson/LessonView";
import {
  TOTAL_LESSONS,
  TRACKS,
  getDepth,
  getFact,
  getWhy,
  getLessonContext,
} from "@/lib/course";

type Params = { params: Promise<{ lessonId: string }> };

export async function generateStaticParams() {
  return TRACKS.flatMap((track) =>
    track.lessons.map((lesson) => ({ lessonId: lesson.id })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lessonId } = await params;
  const context = getLessonContext(lessonId);
  if (!context) return { title: "Lesson not found · Math for a CS Degree" };
  return { title: `${context.lesson.title} · Math for a CS Degree` };
}

export default async function LessonPage({ params }: Params) {
  const { lessonId } = await params;
  const context = getLessonContext(lessonId);
  if (!context) notFound();

  const { lesson, track, index, prev, next } = context;

  return (
    <LessonView
      lesson={lesson}
      track={{ id: track.id, n: track.n }}
      position={{ index: index + 1, total: TOTAL_LESSONS }}
      prev={prev}
      next={next}
      depth={getDepth(lesson.id)}
      why={getWhy(lessonId)}
      fact={getFact(lesson.id)}
    />
  );
}
