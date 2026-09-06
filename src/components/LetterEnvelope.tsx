import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface LetterEnvelopeProps {
  onOpen: () => void;
  groom?: string;
  bride?: string;
  monogram?: string;
}

/**
 * Full-screen "sealed letter" gate shown before the site loads.
 * Reads ?prefix=&name= from the URL to personalize the greeting.
 * Clicking/tapping plays an opening animation, then calls onOpen()
 * so the parent can unmount this and reveal the real site.
 */
export default function LetterEnvelope({ onOpen, groom, bride, monogram }: LetterEnvelopeProps) {
  const [stage, setStage] = useState<'sealed' | 'opening' | 'done'>('sealed');
  const [guest, setGuest] = useState({ prefix: '', name: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGuest({
      prefix: params.get('prefix') || '',
      name: params.get('name') || 'Guest',
    });
  }, []);

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('opening');
    // Duration should match the letter-slide + flap animation below
    setTimeout(() => {
      setStage('done');
      onOpen();
    }, 1400);
  };

  const greeting = `Dear ${guest.prefix ? guest.prefix + ' ' : ''}${guest.name},`;

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-brand-cream flex flex-col items-center justify-center select-none overflow-hidden"
        >
          <div className="absolute inset-0 linen-texture opacity-40 pointer-events-none" />

          {/* Envelope */}
          <div
            className="relative w-[300px] sm:w-[380px] h-[220px] sm:h-[260px] cursor-pointer group"
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            aria-label="Open your wedding invitation"
            onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
          >
            {/* Envelope back pocket */}
            <div className="absolute inset-0 rounded-md bg-brand-primary/95 shadow-2xl border border-brand-gold/20 z-10" />

            {/* Letter card, slides up out of the envelope */}
            <motion.div
              animate={
                stage === 'opening'
                  ? { y: '-78%', scale: 1.04 }
                  : { y: '6%', scale: 1 }
              }
              transition={{ duration: 0.9, ease: 'easeOut', delay: stage === 'opening' ? 0.35 : 0 }}
              className="absolute left-[6%] right-[6%] bottom-0 h-[80%] bg-brand-cream rounded-sm shadow-xl z-20 flex flex-col items-center justify-center px-5 text-center border border-brand-gold/15"
            >
              <Heart className="w-5 h-5 text-brand-gold mb-3" />
              <p className="font-serif text-base sm:text-lg text-brand-primary italic">{greeting}</p>
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-primary/60 mt-3 leading-relaxed">
                You are lovingly invited to the wedding of
              </p>
              <p className="font-serif text-lg sm:text-xl text-brand-accent mt-1">
                {groom || 'Tharindu'} &amp; {bride || 'Susandi'}
              </p>
            </motion.div>

            {/* Envelope front flap, folds open */}
            <motion.div
              animate={stage === 'opening' ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top', transformStyle: 'preserve-3d' }}
              className="absolute top-0 left-0 right-0 h-[52%] bg-brand-primary z-30 border border-brand-gold/25"
            >
              <div
                className="w-full h-full"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: 'linear-gradient(160deg, #2b2b2b, #1a1a1a)',
                }}
              />
            </motion.div>

            {/* Seal, sits on top of the flap point */}
            {stage === 'sealed' && (
              <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-brand-gold flex items-center justify-center shadow-md">
                <span className="font-serif text-brand-primary text-sm font-bold tracking-tight">
                  {monogram || 'T&S'}
                </span>
              </div>
            )}
          </div>

          {stage === 'sealed' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-primary/60 font-bold mt-8"
            >
              Tap the seal to open your invitation
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
