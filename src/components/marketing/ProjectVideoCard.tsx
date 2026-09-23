"use client";

import type { ProjectVideo } from "@/lib/projects-data";

// Vertical phone footage in an elevated card. The watermark is burned into
// the video file itself; hiding the download button and the right-click menu
// just stops the casual "save video as".
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
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          aria-label={`${project.title} installed by PowerNexa Solutions in ${project.location}`}
        />
      </div>
      <figcaption className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-dark">{project.location}</p>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-tight text-navy">{project.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-charcoal/70">{project.specs}</p>
      </figcaption>
    </figure>
  );
}
