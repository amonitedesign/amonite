'use client';

import React, { useEffect, useState } from 'react';

const WORDS = [
  'vases & interior decor',
  'Nordic ribbed planters',
  'organic ceramic bowls',
  'architectural stoneware',
  'fluted pedestal vessels',
  'sculptural lighting shells',
];

export default function DynamicHeroHeadline(): React.JSX.Element {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(WORDS[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    let timeoutId: NodeJS.Timeout;

    if (!isDeleting && displayedText === currentWord) {
      // Pause at full word for reading
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, 2400);
    } else if (isDeleting && displayedText === '') {
      // Pause briefly when empty, then switch to next word
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % WORDS.length);
      }, 400);
    } else {
      // Typing or deleting letter by letter
      const speed = isDeleting ? 30 : 55;
      timeoutId = setTimeout(() => {
        setDisplayedText((prev) =>
          isDeleting
            ? currentWord.substring(0, prev.length - 1)
            : currentWord.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, wordIndex]);

  return (
    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#141311] dark:text-[#f2efe9] tracking-tight leading-[1.08] text-left">
      {/* Accessible text for screen readers, automated testing, and SEO */}
      <span className="sr-only">
        Sculpt bespoke minimal vases &amp; interior decor, right in your browser.
      </span>

      {/* Visual dynamic typewriter presentation */}
      <span aria-hidden="true">
        <span>Sculpt bespoke minimal </span>
        <span className="relative inline-block text-[#c28456] dark:text-[#d4a373] underline decoration-[#c28456]/30 dark:decoration-[#d4a373]/30 underline-offset-8">
          {displayedText}
          <span
            className="inline-block w-[2.5px] sm:w-[3px] h-[0.82em] ml-1.5 bg-[#c28456] dark:bg-[#d4a373] animate-pulse align-baseline"
          />
        </span>
        <span className="block sm:inline sm:ml-0.5">, right in your browser.</span>
      </span>
    </h1>
  );
}
