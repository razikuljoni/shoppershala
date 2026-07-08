import { useActiveBanners } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, m, domAnimation } from 'framer-motion';

export default function BannerCarousel() {
  const { data, isLoading } = useActiveBanners();
  const banners = data?.data || [];
  const [current, setCurrent] = useState(0);

  const len = banners.length;

  useEffect(() => {
    if (len < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % len);
    }, 5000);
    return () => clearInterval(timer);
  }, [len]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[340px] rounded-xl overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (len === 0) return null;

  const banner = banners[current];

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[340px] rounded-xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <m.div
            key={banner._id || current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
          </m.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(4,6,10,0.85)] via-[rgba(4,6,10,0.4)] to-transparent" />

        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-14">
          <AnimatePresence mode="wait">
            <m.div
              key={`text-${banner._id || current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="max-w-xl space-y-2"
            >
              {banner.subtitle && (
                <span className="text-xs sm:text-sm font-medium text-(--color-primary) tracking-widest uppercase">
                  {banner.subtitle}
                </span>
              )}
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold text-(--color-foreground) leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {banner.title}
              </h2>
              {banner.link && banner.linkText && (
                <a
                  href={banner.link}
                  className="inline-block mt-2 px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-(--color-primary) text-white hover:opacity-90 transition-opacity"
                >
                  {banner.linkText}
                </a>
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        {len > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((b, i) => (
              <button
                key={b._id || i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-(--color-primary) w-5' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </LazyMotion>
  );
}
