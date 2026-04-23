export interface SM2Card {
  ease_factor: number
  interval: number
  repetitions: number
}

export type Rating = 0 | 1 | 2 | 3 // Again, Hard, Good, Easy

export interface SM2Result extends SM2Card {
  due_date: Date
  xp_awarded: number
}

const XP_BY_RATING = [0, 1, 2, 3] as const

export function calculateNextReview(card: SM2Card, rating: Rating): SM2Result {
  let { ease_factor, interval, repetitions } = card

  if (rating === 0) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * ease_factor)

    ease_factor = Math.max(1.3, ease_factor + (0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02)))
    repetitions += 1
  }

  const due_date = new Date()
  due_date.setDate(due_date.getDate() + interval)

  return {
    ease_factor,
    interval,
    repetitions,
    due_date,
    xp_awarded: XP_BY_RATING[rating],
  }
}

export function getIntervalLabel(rating: Rating, card: SM2Card): string {
  const result = calculateNextReview(card, rating)
  const days = result.interval
  if (days < 1) return '< 1 min'
  if (days === 1) return '1 day'
  if (days < 7) return `${days} days`
  if (days < 30) return `${Math.round(days / 7)} weeks`
  return `${Math.round(days / 30)} months`
}
