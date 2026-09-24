"use client";

import type { ProjectVideo } from "@/lib/projects-data";

// Vertical phone footage in an elevated card. The PowerNexa watermark is
// burned into the video file itself, so the videos are free to download and
// share (owner request, Sept 2026).
export function ProjectVideoCard({
  project,
  priority = false,
  compact = false,
}: {
  project: ProjectVideo;
  priority?: boolean;
  compact?: boolean; // 4:5 crop for carousels, full 9:16 elsewhere
}) {
  return (
    <figure className="group h-full overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_-24px_rgba(9,43,76,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-24px_rgba(9,43,76,0.4)]">
      <div className={`relative bg-navy-ink ${compact ? "aspect-[4/5]" : "aspect-[9/16]"}`}>
        <video
          className="h-full w-full object-cover"
          src={project.video}
          poster={project.poster}
          controls
          playsInline
          preload={priority ? "metadata" : "none"}
          controlsList="noplaybackrate"
          disablePictureInPicture
          aria-label={`${project.title} installed by PowerNexa Solutions in ${project.location}`}
        />
      </div>
      <figcaption className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-dark">{project.location}</p>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-tight text-navy">{project.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">{project.specs}</p>
        <a
          href={project.video}
          download={`powernexa-${project.slug}.mp4`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-dark hover:text-orange"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
          </svg>
          Download video
          <span className="sr-only">: {project.title}, {project.location}</span>
        </a>
      </figcaption>
    </figure>
  );
}
