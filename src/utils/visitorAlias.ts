import { randomSupervillain } from 'supervillains'

const FALLBACK_ALIAS = 'Unknown Operative'

export const generateVisitorAlias = (): string => {
  const alias = randomSupervillain().trim()

  return alias || FALLBACK_ALIAS
}