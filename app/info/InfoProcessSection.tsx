"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    title: "About me",
    body: "Every successful product begins with understanding. I analyze business goals, user behavior, market opportunities, and technical requirements to uncover the real challenges and identify the most effective path toward a meaningful digital solution.",
  },
  {
    title: "Strategy",
    body: "A clear strategy transforms ideas into actionable plans. By defining priorities, architecture, user flows, technology choices, and project milestones, I create a roadmap that aligns business objectives with measurable outcomes and long-term scalability.",
  },
  {
    title: "Design",
    body: "Design is more than aesthetics—it shapes experiences. I craft intuitive interfaces, seamless user journeys, and responsive layouts that balance visual appeal with usability, ensuring users can interact with products naturally and efficiently.",
  },
  {
    title: "Mettle",
    body: "Mettle represents disciplined execution and engineering excellence. Using modern technologies, scalable architectures, and clean development practices, I build reliable, high-performance applications that are secure, maintainable, and ready for future growth.",
  },
  {
    title: "Impact",
    body: "The goal is not simply launching a product but delivering results. Through optimization, performance improvements, analytics, and continuous refinement, I help transform digital products into valuable assets that drive engagement, growth, and success.",
  },
] as const;

export default function InfoProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = gsap.utils.toArray<HTMLElement>(".item", section);
    if (!items.length) return;

    gsap.set(items, { autoAlpha: 0, y: 48 });
    gsap.set(items[0], { autoAlpha: 1, y: 0 });

    const onLenisScroll = () => ScrollTrigger.update();

    if (lenis) {
      lenis.on("scroll", onLenisScroll);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (items.length - 1)}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      items.forEach((item, index) => {
        if (index === 0) return;
        const prev = items[index - 1];
        tl.to(prev, {
          autoAlpha: 0,
          y: -48,
          duration: 1,
          ease: "power2.in",
        }).fromTo(
          item,
          { autoAlpha: 0, y: 48 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
          "<"
        );
      });
    }, section);

    ScrollTrigger.refresh();

    return () => {
      if (lenis) lenis.off("scroll", onLenisScroll);
      ctx.revert();
    };
  }, [lenis]);

  return (
    <div
      ref={sectionRef}
      className="h-screen 2xl:px-44 px-24 pt-14 overflow-hidden"
    >
      <div className="relative h-full w-full">
        {ITEMS.map(({ title, body }) => (
          <div key={title} className="item absolute inset-0 flex flex-col justify-center">
            <h2 className="text-sm font-bold">{title}</h2>
            <div className="pl-10 py-10 font-light leading-snug max-w-3xl">
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
