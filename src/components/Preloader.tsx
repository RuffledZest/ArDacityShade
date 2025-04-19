import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (count > 5) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{ height: 'var(--app-height, 100vh)' }}
      animate={isComplete ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-screen w-full flex items-center justify-center">
        {/* CandleStand static image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/CandleStand.png"
            alt="Candle Stand"
            className="object-contain w-[70%] sm:w-[60%] md:w-[50%] max-w-[400px]"
          />
        </div>
        
        {/* Numeric counter */}
        <div className="relative">
          <AnimatePresence initial={false} mode="wait">
            {count >= 1 && count <= 5 && (
              <motion.div
                key={`count-${count}`}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20 
                }}
                className="text-white text-[10rem] sm:text-[12rem] md:text-[15rem] font-bold"
              >
                {count}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}