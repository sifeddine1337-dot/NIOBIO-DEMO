import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 up to `end` the first time the returned ref enters
 * the viewport — the behaviour of the Elementor counters on the source site.
 */
export function useCountUp(end: number, duration = 2000) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [value, setValue] = useState(() =>
    // With no IntersectionObserver support, show the final value immediately.
    typeof IntersectionObserver === 'undefined' ? end : 0,
  )
  const hasStarted = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasStarted.current) continue
          hasStarted.current = true
          const startedAt = performance.now()

          const step = (now: number) => {
            const progress = Math.min((now - startedAt) / duration, 1)
            // easeOutCubic, matching the feel of the original counters.
            setValue(Math.round(end * (1 - (1 - progress) ** 3)))
            if (progress < 1) frame = requestAnimationFrame(step)
          }

          frame = requestAnimationFrame(step)
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [end, duration])

  return { ref, value }
}
