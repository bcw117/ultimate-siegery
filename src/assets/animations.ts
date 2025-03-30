"use client";
import { useEffect, useState } from "react";

// Intersection Observer hook for scroll-triggered animations
export function useInView(
  ref: React.RefObject<HTMLElement>,
  options = { threshold: 0.1, triggerOnce: true }
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.triggerOnce) {
            observer.disconnect();
          }
        } else if (!options.triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold: options.threshold }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.triggerOnce]);

  return isInView;
}

// Staggered animation for multiple elements
export function useStaggeredAnimation(itemCount: number, baseDelay = 0.1) {
  return Array.from({ length: itemCount }, (_, i) => ({
    transition: {
      delay: baseDelay * i,
    },
  }));
}

// Text scramble effect
export function useTextScramble(finalText: string, duration = 1500) {
  const [text, setText] = useState("");
  const characters = "!<>-_\\/[]{}—=+*^?#________";
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let frame = 0;
    const frameRate = 30;
    let complete = 0;

    const update = () => {
      let output = "";
      if (frame === frameRate) {
        complete = 1;
        setText(finalText);
        clearInterval(interval);
        return;
      }

      for (let i = 0; i < finalText.length; i++) {
        if (i < complete * finalText.length) {
          output += finalText[i];
        } else if (finalText[i] === " ") {
          output += " ";
        } else {
          output += characters[Math.floor(Math.random() * characters.length)];
        }
      }

      setText(output);
      frame++;
    };

    interval = setInterval(update, duration / frameRate);

    return () => clearInterval(interval);
  }, [finalText, duration]);

  return text;
}
