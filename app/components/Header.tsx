"use client";

import gsap from "gsap";
import Link from "next/link";
import SplitType from "split-type";
import { useLayoutEffect, useRef } from "react";

/** Same rhythm as `HeroAnimatedHeading` on `app/page.tsx` (ink width + keystroke stagger). */
const HEADER_KEYSTROKE_GAP = 0.068;
const HEADER_INK_DURATION = 0.00048;

function TypewriterLabel({
    text,
    delay = 0,
    className = "",
}: {
    text: string;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || !text.trim()) return;

        const split = new SplitType(el, {
            types: "lines,words,chars",
            tagName: "span",
        });
        const chars = split.chars;
        if (!chars?.length) return;
        document.querySelectorAll('.word').forEach(word => {
            (word as HTMLElement).style.display = 'flex';
        });
        document.querySelectorAll('.line').forEach(line => {
            (line as HTMLElement).style.display = 'flex';
            (line as HTMLElement).style.gap = '6px';
        });
        gsap.set(chars, {
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "baseline",
            boxSizing: "content-box",
            width: 0,
            autoAlpha: 0,
        });

        gsap.set(el, { autoAlpha: 1 });

        const ctx = gsap.context(() => {
            gsap.fromTo(
                chars,
                { width: 0, autoAlpha: 0 },
                {
                    width: "auto",
                    autoAlpha: 1,
                    duration: HEADER_INK_DURATION,
                    ease: "none",
                    delay,
                    stagger: { each: HEADER_KEYSTROKE_GAP, from: "start" },
                }
            );
        }, el);

        return () => {
            ctx.revert();
            split.revert();
        };
    }, [text, delay]);

    return (
        <span
            ref={ref}
            className={`flex whitespace-nowrap align-baseline opacity-0 ${className}`.trim()}
        >
            {text}
        </span>
    );
}

const Header = () => {
    return (
        <div className="fixed top-0 left-0 z-50 flex h-8 w-full items-center justify-between px-10">
            <div className="flex min-w-[500px] items-center justify-start">
                <Link href="/" className="text-sm font-bold hover:underline">
                    <TypewriterLabel text="Yashwant Rao" delay={0} />
                </Link>
            </div>
            <div className="flex w-full items-center justify-between">
                <div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold hover:underline"
                    >
                        <span
                            className="flex size-1.5 shrink-0 rounded-full bg-black"
                            aria-hidden
                        />
                        <TypewriterLabel text="Home" delay={0.22} />
                    </Link>
                </div>
                <div className="flex items-center gap-0">
                    <Link href="/work" className="text-sm font-bold hover:underline ml-2">
                        <TypewriterLabel text="Work" delay={0.38} />
                    </Link>,
                    <Link href="/about" className="text-sm font-bold hover:underline ml-2">
                        <TypewriterLabel text="About Me" delay={0.48} />
                    </Link>
                </div>
            </div>
            <div className="flex min-w-[500px] justify-end">
                <Link href="/contact" className="text-sm font-bold hover:underline">
                    <TypewriterLabel text="Contact" delay={0.62} />
                </Link>
            </div>
        </div>
    );
};

export default Header;
