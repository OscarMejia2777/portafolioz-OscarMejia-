import { useTransform, type MotionValue } from 'framer-motion'

export function useParallax(
  scrollYProgress: MotionValue<number>,
  start: number,
  end: number,
  outputRange: [number, number] = [0, -100]
) {
  return useTransform(scrollYProgress, [start, end], outputRange)
}
