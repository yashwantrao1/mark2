"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function InfoProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [imagePath, setImagePath] = useState("/img/insight.jpeg");
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



  const updateimage = (e: React.MouseEvent<HTMLDivElement>) => {
    const image = e.currentTarget.dataset.image;
    const randomImage = document.querySelector('#randomImage');

    if (image) {
      setImagePath(image);
    }

    if (!randomImage) return;

    const maxTop = window.innerHeight - 150; // image height
    const maxLeft = window.innerWidth - 250; // image width

    const top = Math.random() * (maxTop - window.innerHeight * 0.05) + window.innerHeight * 0.05;
    const left = Math.random() * (maxLeft - window.innerWidth * 0.05) + window.innerWidth * 0.05;

    gsap.to(randomImage, {
      display: "block",
      top,
      left,
      duration: 0,
    });
  };

  const updateImageLocaion = () => {
    const randomImage = document.querySelector('#randomImage');
    if (!randomImage) return;
    gsap.to(randomImage, {
      display: "none",
      duration: 0,
    });    
  }

  return (
    <div
      ref={sectionRef}
      className="h-screen 2xl:px-44 px-24 py-14 overflow-hidden bg-(--offWhite)"
    >
      <div className="relative h-full w-full flex flex-col  justify-around gap-3 text-(--offWhite) mix-blend-difference">
        <div onMouseEnter={updateimage}  onMouseLeave={updateImageLocaion} data-image='/img/insight.jpeg' className="item relative inset-0 flex flex-col justify-center w-1/3 ">
          <h2 className="text-sm font-bold">Insight</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg  leading-snug max-w-3xl">
            <p>Understanding the problem is the first step. I analyze goals, users, and opportunities to uncover challenges and identify the best path forward.</p>
          </div>
        </div>
        <div onMouseEnter={updateimage}  onMouseLeave={updateImageLocaion} data-image='/img/strategy.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3 ml-[15%]">
          <h2 className="text-sm font-bold">Strategy</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg leading-snug max-w-3xl">
            <p>A strong strategy turns ideas into action. I define priorities, technology, and workflows to create a clear roadmap for success.</p>
          </div>
        </div>
        <div onMouseEnter={updateimage}  onMouseLeave={updateImageLocaion} data-image='/img/design.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3 ml-[30%]">
          <h2 className="text-sm font-bold">Design</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg leading-snug max-w-3xl">
            <p>Great design creates meaningful experiences. I craft intuitive, user-focused interfaces that balance usability, accessibility, and visual appeal.</p>
          </div>
        </div>
        <div onMouseEnter={updateimage}  onMouseLeave={updateImageLocaion} data-image='/img/mettle.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3 ml-[45%]">
          <h2 className="text-sm font-bold">Mettle</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg leading-snug max-w-3xl">
            <p>Execution is where ideas become reality. Using modern technologies and clean architecture, I build scalable, reliable, and high-performing solutions.</p>
          </div>
        </div>
        <div onMouseEnter={updateimage}  onMouseLeave={updateImageLocaion} data-image='/img/impact.jpg' className="item relative inset-0 flex flex-col justify-center w-1/3 ml-[60%]">
          <h2 className="text-sm font-bold">Impact</h2>
          <div className="pl-5 2xl:py-5 py-2 font-light 2xl:text-lg leading-snug max-w-3xl">
            <p>Success is measured by results. Through optimization and continuous improvement, I create products that drive engagement, growth, and lasting value.</p>
          </div>
        </div>
      </div>
      <div id="randomImage" className="absolute 2xl:h-60 h-44 aspect-5/4 z-[-1] top-0 left-0 hidden">
        <Image src={imagePath} alt='Info Process' width={500} height={500} className="h-full w-full object-cover grayscale-100"></Image>
      </div>
    </div>
  );
}
