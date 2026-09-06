"use client"; // remove this line if you're not on Next.js App Router

import { useState, useEffect } from "react";
// If you're on Next.js App Router, prefer this over window.location:
// import { useSearchParams } from "next/navigation";

/**
 * LetterGate
 * Wrap your page content with this component:
 *
 *   <LetterGate>
 *     <YourActualWeddingSite />
 *   </LetterGate>
 *
 * It shows a sealed envelope first. Clicking it plays an opening
 * animation, then reveals the children (your real site).
 */
export default function LetterGate({ children }) {
  const [opened, setOpened] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [guest, setGuest] = useState({ prefix: "", name: "" });

  useEffect(() => {
    // Plain-React / any-framework way to read the query string.
    // If using Next.js App Router, swap this for useSearchParams().
    const params = new URLSearchParams(window.location.search);
    setGuest({
      prefix: params.get("prefix") || "",
      name: params.get("name") || "our valued guest",
    });
  }, []);

  const handleOpen = () => {
    setAnimating(true);
    // Match this timeout to your CSS animation duration below (900ms)
    setTimeout(() => {
      setOpened(true);
    }, 900);
  };

  if (opened) {
    // Animation finished — show the real site
    return children;
  }

  const greeting = `Dear ${guest.prefix ? guest.prefix + " " : ""}${guest.name},`;

  return (
    <div className={`letter-gate ${animating ? "letter-gate--opening" : ""}`}>
      <div className="envelope">
        {/* The letter itself, tucked inside, slides up when opened */}
        <div className="letter">
          <p className="letter__greeting">{greeting}</p>
          <p className="letter__body">
            You are warmly invited to celebrate the wedding of
            <br />
            <strong>Tharindu &amp; Susandi</strong>
          </p>
          <p className="letter__cta">Click to open your invitation</p>
        </div>

        {/* The envelope flap that swings open */}
        <div className="envelope__flap" />
        <div className="envelope__body" onClick={handleOpen} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          aria-label="Open your wedding invitation">
          <span className="envelope__seal">💌</span>
        </div>
      </div>

      <style jsx>{`
        .letter-gate {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4ede4;
        }
        .envelope {
          position: relative;
          width: min(320px, 80vw);
          height: 220px;
          cursor: pointer;
        }
        .envelope__body {
          position: absolute;
          inset: 0;
          background: #fffaf3;
          border: 1px solid #d8c9b0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 2;
        }
        .envelope__flap {
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          height: 50%;
          background: #f2e6d4;
          border: 1px solid #d8c9b0;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform-origin: top;
          transition: transform 0.9s ease;
          z-index: 3;
        }
        .envelope__seal {
          font-size: 2rem;
        }
        .letter {
          position: absolute;
          left: 5%;
          right: 5%;
          bottom: 6px;
          background: #fff;
          border-radius: 4px;
          padding: 20px 16px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transform: translateY(90%);
          transition: transform 0.9s ease 0.15s;
          z-index: 1;
        }
        .letter__greeting {
          font-weight: 600;
          margin-bottom: 8px;
        }
        .letter__body {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 8px;
        }
        .letter__cta {
          font-size: 0.75rem;
          color: #999;
        }

        /* Opening animation state */
        .letter-gate--opening .envelope__flap {
          transform: rotateX(180deg);
        }
        .letter-gate--opening .letter {
          transform: translateY(-40%);
        }
        .letter-gate--opening .envelope__body {
          opacity: 0;
          transition: opacity 0.4s ease 0.5s;
        }
      `}</style>
    </div>
  );
}
