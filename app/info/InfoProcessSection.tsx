"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Image from "next/image";
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

    gsap.set(items, { autoAlpha: 0, x: 500 });
    gsap.set(items[0], { autoAlpha: 1, x: 500 });

    const onLenisScroll = () => ScrollTrigger.update();

    if (lenis) {
      lenis.on("scroll", onLenisScroll);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value?: number) {
          if (arguments.length && value !== undefined) {
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
        tl.fromTo(
          item,
          { autoAlpha: 0, x: 500 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
          }
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
      className="h-screen 2xl:px-44 px-24 py-14 overflow-hidden"
    >
      <div className="relative h-full w-full flex flex-col  justify-around gap-3">
        <div data-image='/img/insight.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3">
          <h2 className="text-sm font-bold">Insight</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg  leading-snug max-w-3xl">
            <p>Understanding the problem is the first step. I analyze goals, users, and opportunities to uncover challenges and identify the best path forward.</p>
          </div>
        </div>
        <div data-image='/img/strategy.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3 ml-[15%]">
          <h2 className="text-sm font-bold">Strategy</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg leading-snug max-w-3xl">
            <p>A strong strategy turns ideas into action. I define priorities, technology, and workflows to create a clear roadmap for success.</p>
          </div>
        </div>
        <div data-image='/img/design.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3 ml-[30%]">
          <h2 className="text-sm font-bold">Design</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg leading-snug max-w-3xl">
            <p>Great design creates meaningful experiences. I craft intuitive, user-focused interfaces that balance usability, accessibility, and visual appeal.</p>
          </div>
        </div>
        <div data-image='/img/mettle.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3 ml-[45%]">
          <h2 className="text-sm font-bold">Mettle</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg leading-snug max-w-3xl">
            <p>Execution is where ideas become reality. Using modern technologies and clean architecture, I build scalable, reliable, and high-performing solutions.</p>
          </div>
        </div>
        <div data-image='/img/impact.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3 ml-[60%]">
          <h2 className="text-sm font-bold">Impact</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg leading-snug max-w-3xl">
            <p>Success is measured by results. Through optimization and continuous improvement, I create products that drive engagement, growth, and lasting value.</p>
          </div>
        </div>
      </div>
      <div>
        <Image src='/img/impact.jpg' alt='Info Process' width={500} height={500}></Image>
      </div>
    </div>
  );
}
