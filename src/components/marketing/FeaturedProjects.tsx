"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GlowOrb } from "@/components/ui/GlowOrb";
import { ProjectVideoCard } from "./ProjectVideoCard";
import { ChevronIcon } from "./Icons";
import { PROJECTS_COMPLETED, PROJECT_VIDEOS } from "@/lib/projects-data";

// Swipeable carousel of install videos with an arrow at each end. Native
// scroll-snap does the moving (so touch swipes work too); the arrows just
// scroll by one card. Starting a video pauses any other one that's playing.
export function FeaturedProjects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateArrows]);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const pauseOthers = (event: React.SyntheticEvent) => {
    trackRef.current?.querySelectorAll("video").forEach((video) => {
      if (video !== event.target) video.pause();
    });
  };

  return (
    <section className="relative overflow-hidden bg-mist py-24">
      <GlowOrb color="orange" className="-right-24 top-10 h-72 w-72" />
      <GlowOrb color="navy" className="-left-24 bottom-0 h-64 w-64" />
      <Container className="relative">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Featured Projects" title="A look at work we've completed" />
          <Link href="/projects" className="shrink-0 text-sm font-semibold text-orange hover:text-orange-dark">
            See all projects →
          </Link>
        </Reveal>

        <Reveal delay={120} className="relative mt-10">
          <div
            ref={trackRef}
            onScroll={updateArrows}
            onPlayCapture={pauseOthers}
            className="-mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-2 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Featured project videos"
            role="region"
          >
            {PROJECT_VIDEOS.map((project, index) => (
              <div key={project.slug} data-slide className="w-[78%] shrink-0 snap-start sm:w-[290px]">
                <ProjectVideoCard project={project} priority={index < 2} compact />
              </div>
            ))}
            <div data-slide className="w-[78%] shrink-0 snap-start sm:w-[290px]">
              <Link
                href="/projects"
                className="group flex h-full min-h-[360px] flex-col justify-end rounded-[28px] bg-gradient-to-br from-navy to-navy-ink p-7 text-white shadow-[0_20px_50px_-24px_rgba(9,43,76,0.5)] transition duration-300 hover:-translate-y-1"
              >
                <p className="font-mono-num text-5xl font-bold text-orange">{PROJECTS_COMPLETED - PROJECT_VIDEOS.length}+</p>
                <p className="mt-3 font-display text-xl font-bold leading-snug">more installs across Lagos.</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 group-hover:text-white">
                  See all projects <ChevronIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>

          <CarouselArrow side="left" disabled={!canPrev} onClick={() => scroll(-1)} />
          <CarouselArrow side="right" disabled={!canNext} onClick={() => scroll(1)} />
        </Reveal>
      </Container>
    </section>
  );
}

function CarouselArrow({ side, disabled, onClick }: { side: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous project" : "Next project"}
      className={`absolute top-[38%] z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_12px_30px_-10px_rgba(9,43,76,0.45)] transition duration-200 hover:scale-110 hover:bg-orange hover:text-white disabled:pointer-events-none disabled:opacity-40 ${
        side === "left" ? "-left-2 sm:-left-5" : "-right-2 sm:-right-5"
      }`}
    >
      <ChevronIcon direction={side} className="h-5 w-5" />
    </button>
  );
}
