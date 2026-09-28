import type { SocialLink } from '../../data/site'
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from './Icons'

const ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
} as const

/**
 * Renders a social icon. The live site only wires up Facebook; Instagram,
 * Twitter and Youtube appear there as unlinked icons, which is reproduced here
 * with an inert `<span>` rather than a dead anchor.
 */
export function SocialIcon({ social, size = 18 }: { social: SocialLink; size?: number }) {
  const Icon = ICONS[social.icon]

  if (!social.href) {
    return (
      <span className="social-link social-link--static" title={social.label}>
        <Icon size={size} />
      </span>
    )
  }

  return (
    <a
      className="social-link"
      href={social.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={social.label}
      title={social.label}
    >
      <Icon size={size} />
    </a>
  )
}

export default SocialIcon
