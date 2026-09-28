/**
 * Inline SVG icon set — modern "solid" style.
 *
 * Object glyphs are filled shapes (`fill="currentColor"`, rounded joins);
 * directional marks (chevrons, close, check, plus/minus) use a bold 2.5px
 * stroke so they stay crisp at small sizes. The mix mirrors contemporary icon
 * systems (heroicons solid + bold strokes). No icon dependency; every icon
 * inherits `currentColor` and defaults to 20px.
 */
import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

/** Filled glyph container. */
const solid = ({ size = 20, ...rest }: IconProps, children: ReactNode) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
)

/** Bold-stroke container for directional marks. */
const stroked = ({ size = 20, ...rest }: IconProps, children: ReactNode) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    {children}
  </svg>
)

export const ChevronDownIcon = (props: IconProps) =>
  stroked(props, <path d="m6 9.5 6 6 6-6" />)

export const ChevronLeftIcon = (props: IconProps) =>
  stroked(props, <path d="m14.5 18-6-6 6-6" />)

export const ChevronRightIcon = (props: IconProps) =>
  stroked(props, <path d="m9.5 18 6-6-6-6" />)

export const SearchIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M10.5 2.75a7.75 7.75 0 1 0 4.8 13.84l4.18 4.18a1.25 1.25 0 0 0 1.77-1.77l-4.18-4.18A7.75 7.75 0 0 0 10.5 2.75ZM5.25 10.5a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
    />,
  )

export const CartIcon = (props: IconProps) =>
  solid(
    props,
    <>
      <path d="M2 3h2.42a1.25 1.25 0 0 1 1.23 1.02l.4 2.13.06.35h14.44a1.25 1.25 0 0 1 1.22 1.53l-1.63 6.9a2.6 2.6 0 0 1-2.53 2.01H9.1a2.6 2.6 0 0 1-2.55-2.08L4.72 6.3 4.4 4.5H2a1.25 1.25 0 0 1 0-2.5Z" />
      <path d="M7.6 21.9a1.95 1.95 0 1 0 0-3.9 1.95 1.95 0 0 0 0 3.9Zm9.3 0a1.95 1.95 0 1 0 0-3.9 1.95 1.95 0 0 0 0 3.9Z" />
    </>,
  )

export const MenuIcon = (props: IconProps) =>
  solid(
    props,
    <path d="M3.25 6.25h17.5a1.25 1.25 0 0 1 0 2.5H3.25a1.25 1.25 0 0 1 0-2.5Zm0 4.5h17.5a1.25 1.25 0 0 1 0 2.5H3.25a1.25 1.25 0 0 1 0-2.5Zm0 4.5h17.5a1.25 1.25 0 0 1 0 2.5H3.25a1.25 1.25 0 0 1 0-2.5Z" />,
  )

export const CloseIcon = (props: IconProps) =>
  stroked(props, <path d="m6.2 6.2 11.6 11.6M17.8 6.2 6.2 17.8" />)

export const CheckIcon = (props: IconProps) =>
  stroked(props, <path d="m20 6.8-11 11-5-5" />)

export const PlusIcon = (props: IconProps) =>
  stroked(props, <path d="M12 5.4v13.2M5.4 12h13.2" />)

export const MinusIcon = (props: IconProps) =>
  stroked(props, <path d="M5.4 12h13.2" />)

export const PhoneIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M3.1 2.3 6.6 2a2 2 0 0 1 2.1 1.6l.7 3.2a2 2 0 0 1-.6 1.9l-1.6 1.5a14.6 14.6 0 0 0 6.6 6.6l1.5-1.6a2 2 0 0 1 1.9-.6l3.2.7a2 2 0 0 1 1.6 2.1l-.3 3.5a2.2 2.2 0 0 1-2.2 1.8C7.9 22.7 1.3 16.1 1.3 4.5c0-1.1.8-2 1.8-2.2Z"
    />,
  )

export const MailIcon = (props: IconProps) =>
  solid(
    props,
    <>
      <path
        fillRule="evenodd"
        d="M1.75 6.5c0-1.8 1.45-3.25 3.25-3.25h14c1.8 0 3.25 1.45 3.25 3.25v11c0 1.8-1.45 3.25-3.25 3.25H5A3.25 3.25 0 0 1 1.75 17.5v-11Zm2.53-.86 6.53 4.79a2.1 2.1 0 0 0 2.38 0l6.53-4.8A1.75 1.75 0 0 0 19 4.75H5c-.28 0-.53.07-.72.89Z"
      />
    </>,
  )

export const PrinterIcon = (props: IconProps) =>
  solid(
    props,
    <>
      <path d="M6.25 3.5c0-.7.55-1.25 1.25-1.25h9c.7 0 1.25.55 1.25 1.25V8h-11.5V3.5Z" />
      <path
        fillRule="evenodd"
        d="M4 7.25A3.25 3.25 0 0 0 .75 10.5v5A3.25 3.25 0 0 0 4 18.75h.75v1.5c0 1.24 1 2.25 2.25 2.25h10c1.24 0 2.25-1 2.25-2.25v-1.5H20a3.25 3.25 0 0 0 3.25-3.25v-5A3.25 3.25 0 0 0 20 7.25H4Zm11.75 11.5v1.5h-7.5v-5h7.5v3.5Zm-9.5-5.25v1.75H4a.75.75 0 0 1 0-1.5h2.25Zm11.5 0H20a.75.75 0 0 1 0 1.5h-2.25V13.5Z"
      />
    </>,
  )

export const PinIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M11.05 21.9c-1-.9-8.3-7.6-8.3-13.15a9.25 9.25 0 0 1 18.5 0c0 5.55-7.3 12.25-8.3 13.15a1.4 1.4 0 0 1-1.9 0ZM12 12.9a4.15 4.15 0 1 0 0-8.3 4.15 4.15 0 0 0 0 8.3Z"
    />,
  )

export const TruckIcon = (props: IconProps) =>
  solid(
    props,
    <>
      <path d="M1.5 5.6c0-1.16.94-2.1 2.1-2.1h8.8c1.16 0 2.1.94 2.1 2.1v.4h2.02c.62 0 1.2.27 1.6.74l2.98 3.5c.32.38.5.86.5 1.36v4.16a2.1 2.1 0 0 1-2.1 2.1h-.62a3.35 3.35 0 0 1-6.6 0H9.85a3.35 3.35 0 0 1-6.6 0h-.05a2.1 2.1 0 0 1-2.1-2.1V5.6Z" />
      <path d="M6.55 20.05a1.85 1.85 0 1 0 0-3.7 1.85 1.85 0 0 0 0 3.7Zm9.35 0a1.85 1.85 0 1 0 0-3.7 1.85 1.85 0 0 0 0 3.7Z" />
    </>,
  )

export const ShieldIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M11.1 2.32a2.5 2.5 0 0 1 1.8 0l6.5 2.46a2 2 0 0 1 1.3 1.87v5.06c0 5.2-3.7 9.16-8.37 10.25a1.9 1.9 0 0 1-.86 0C7.8 20.87 4.1 16.9 4.1 11.71V6.65c0-.86.53-1.62 2-1.87l5-2.46Zm4.55 7.03a1.13 1.13 0 0 0-1.6-1.6L11 10.8l-.95-.95a1.13 1.13 0 0 0-1.6 1.6l1.75 1.75c.44.44 1.16.44 1.6 0l3.85-3.85Z"
    />,
  )

export const RefundIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M11.2 2.15a1.2 1.2 0 0 1 1.7 0l2.15 2.15a1.2 1.2 0 0 1-1.7 1.7l-.1-.1v6.6h6.6l-.1-.1a1.2 1.2 0 0 1 1.7-1.7l2.15 2.15a1.2 1.2 0 0 1 0 1.7l-2.15 2.15a1.2 1.2 0 0 1-1.7-1.7l.1-.1h-7.85a1.25 1.25 0 0 1-1.25-1.25V5.9l-.1.1a1.2 1.2 0 1 1-1.7-1.7L11.2 2.15ZM3.25 13.5c.69 0 1.25.56 1.25 1.25v4.75h15.25a1.25 1.25 0 0 1 0 2.5H3.25c-.69 0-1.25-.56-1.25-1.25v-5.5c0-.69.56-1.25 1.25-1.25Z"
    />,
  )

export const ClockIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0ZM12 5.6c.69 0 1.25.56 1.25 1.25v4.47l2.94 1.7a1.25 1.25 0 0 1-1.25 2.16l-3.57-2.06a1.25 1.25 0 0 1-.62-1.08V6.85c0-.69.56-1.25 1.25-1.25Z"
    />,
  )

export const DownloadIcon = (props: IconProps) =>
  solid(
    props,
    <>
      <path
        fillRule="evenodd"
        d="M11.05 2.7c.53-.53 1.37-.53 1.9 0l3.85 3.85a1.2 1.2 0 0 1-1.7 1.7l-1.85-1.85v8.1a1.25 1.25 0 0 1-2.5 0V6.4L8.9 8.25a1.2 1.2 0 0 1-1.7-1.7l3.85-3.85Z"
      />
      <path d="M3.25 16.5c.69 0 1.25.56 1.25 1.25v1.75h14v-1.75a1.25 1.25 0 0 1 2.5 0v3a1.25 1.25 0 0 1-1.25 1.25H3.25A1.25 1.25 0 0 1 2 20.75v-3c0-.69.56-1.25 1.25-1.25Z" />
    </>,
  )

export const GridIcon = (props: IconProps) =>
  solid(
    props,
    <>
      <path d="M2.5 4.75C2.5 3.5 3.5 2.5 4.75 2.5h4c1.24 0 2.25 1 2.25 2.25v4c0 1.24-1 2.25-2.25 2.25h-4C3.5 11 2.5 10 2.5 8.75v-4Z" />
      <path d="M13 4.75c0-1.24 1-2.25 2.25-2.25h4c1.24 0 2.25 1 2.25 2.25v4c0 1.24-1 2.25-2.25 2.25h-4C14.01 11 13 10 13 8.75v-4Z" />
      <path d="M2.5 15.25c0-1.24 1-2.25 2.25-2.25h4c1.24 0 2.25 1 2.25 2.25v4c0 1.24-1 2.25-2.25 2.25h-4a2.25 2.25 0 0 1-2.25-2.25v-4Z" />
      <path d="M13 15.25c0-1.24 1-2.25 2.25-2.25h4c1.24 0 2.25 1 2.25 2.25v4c0 1.24-1 2.25-2.25 2.25h-4A2.25 2.25 0 0 1 13 19.25v-4Z" />
    </>,
  )

export const TagIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M2.7 5.6c0-1.6 1.3-2.9 2.9-2.9h5.9c.77 0 1.5.3 2.05.85l7.55 7.55a2.9 2.9 0 0 1 0 4.1l-5.15 5.15a2.9 2.9 0 0 1-4.1 0L4.35 12.8A2.9 2.9 0 0 1 3.5 10.75V5.6H2.7Zm5.55 4.9a2.05 2.05 0 1 0 0-4.1 2.05 2.05 0 0 0 0 4.1Z"
    />,
  )

export const SparkIcon = (props: IconProps) =>
  solid(
    props,
    <>
      <path d="M12 2.2l1.98 5.62a2 2 0 0 0 1.22 1.22l5.6 1.96-5.6 1.96a2 2 0 0 0-1.22 1.22L12 20l-1.98-5.62a2 2 0 0 0-1.22-1.22l-5.6-1.96 5.6-1.96a2 2 0 0 0 1.22-1.22L12 2.2Z" />
      <path d="M19.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" opacity="0.75" />
    </>,
  )

export const FacebookIcon = (props: IconProps) =>
  solid(
    props,
    <path d="M13.4 21.9v-8h2.7l.4-3.1h-3.1V8.8c0-.9.25-1.5 1.55-1.5h1.65V4.5c-.3-.04-1.3-.13-2.45-.13-2.4 0-4.05 1.47-4.05 4.17v2.32H7.4v3.1h2.7v8h3.3Z" />,
  )

export const InstagramIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M7.4 2.6h9.2a4.8 4.8 0 0 1 4.8 4.8v9.2a4.8 4.8 0 0 1-4.8 4.8H7.4a4.8 4.8 0 0 1-4.8-4.8V7.4a4.8 4.8 0 0 1 4.8-4.8Zm4.6 5.5a3.9 3.9 0 1 0 0 7.8 3.9 3.9 0 0 0 0-7.8Zm0 2.1a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Zm5.35-2.85a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7Z"
    />,
  )

export const TwitterIcon = (props: IconProps) =>
  solid(
    props,
    <path d="M21 5.3a7.6 7.6 0 0 1-2.2.6 3.8 3.8 0 0 0 1.7-2.1c-.7.4-1.6.8-2.4 1a3.8 3.8 0 0 0-6.5 3.4A10.7 10.7 0 0 1 3.8 4.3a3.8 3.8 0 0 0 1.2 5c-.6 0-1.2-.2-1.7-.5a3.8 3.8 0 0 0 3 3.7c-.6.2-1.2.2-1.8.1a3.8 3.8 0 0 0 3.5 2.6A7.6 7.6 0 0 1 3 16.8a10.7 10.7 0 0 0 5.8 1.7c7 0 10.8-5.8 10.8-10.8v-.5c.7-.5 1.4-1.2 1.9-2Z" />,
  )

export const YoutubeIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M6.2 4.75h11.6a4.35 4.35 0 0 1 4.35 4.35v5.8a4.35 4.35 0 0 1-4.35 4.35H6.2a4.35 4.35 0 0 1-4.35-4.35v-5.8A4.35 4.35 0 0 1 6.2 4.75Zm5.8 4.05L7.9 11.4a.7.7 0 0 0 0 1.2l4.1 2.6c.47.3 1.07-.04 1.07-.6V9.4c0-.56-.6-.9-1.07-.6Z"
    />,
  )

export const LanguageIcon = (props: IconProps) =>
  stroked(
    props,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9h17M3.5 15h17" strokeWidth={2} />
      <path d="M12 3c-2.6 2.6-2.6 15.4 0 18 2.6-2.6 2.6-15.4 0-18Z" strokeWidth={2} />
    </>,
  )

/* ---------- Actions (admin panel & cart) ---------- */

export const TrashIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M9.4 2.2h5.2a2.2 2.2 0 0 1 2.2 2.2v1.05h3.05a1.25 1.25 0 0 1 0 2.5h-.9l-.86 11.3a3.1 3.1 0 0 1-3.1 2.87H9a3.1 3.1 0 0 1-3.1-2.87L5.04 7.95h-.9a1.25 1.25 0 0 1 0-2.5h3.05V4.4A2.2 2.2 0 0 1 9.4 2.2Zm.2 3.25h4.8V4.7a.2.2 0 0 0-.2-.2H9.8a.2.2 0 0 0-.2.2v.75Zm-.77 2.5.79 11.2c.03.44.4.78.84.78h3.08c.44 0 .81-.34.84-.78l.79-11.2H8.83Z"
    />,
  )

export const PencilIcon = (props: IconProps) =>
  solid(
    props,
    <path d="M16.9 2.6a2.5 2.5 0 0 1 3.54 0l.96.96a2.5 2.5 0 0 1 0 3.54l-1.6 1.6-4.5-4.5 1.6-1.6ZM13.53 5.97 3.9 15.6a3 3 0 0 0-.83 1.65l-.55 3.02a1 1 0 0 0 1.17 1.17l3.02-.55a3 3 0 0 0 1.65-.83l9.63-9.63-4.46-4.46Z" />,
  )

export const UploadIcon = (props: IconProps) =>
  solid(
    props,
    <>
      <path
        fillRule="evenodd"
        d="M12.95 2.7a1.34 1.34 0 0 0-1.9 0L7.2 6.55a1.2 1.2 0 0 0 1.7 1.7l1.85-1.85v8.1a1.25 1.25 0 0 0 2.5 0V6.4l1.85 1.85a1.2 1.2 0 0 0 1.7-1.7l-3.85-3.85Z"
      />
      <path d="M3.25 16.5c.69 0 1.25.56 1.25 1.25v1.75h14v-1.75a1.25 1.25 0 0 1 2.5 0v3a1.25 1.25 0 0 1-1.25 1.25H3.25A1.25 1.25 0 0 1 2 20.75v-3c0-.69.56-1.25 1.25-1.25Z" />
    </>,
  )

export const CopyIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M8.4 2.5h7.2a3.4 3.4 0 0 1 3.4 3.4v7.2a3.4 3.4 0 0 1-3.4 3.4H8.4A3.4 3.4 0 0 1 5 13.1V5.9a3.4 3.4 0 0 1 3.4-3.4Zm-3.15 3.9a5.9 5.9 0 0 0-.75 2.9v6.8a4.9 4.9 0 0 0 4.9 4.9h6.8c1.1 0 2.11-.3 2.98-.83a1.25 1.25 0 0 1-1.03 1.83H9.4A6.4 6.4 0 0 1 3 14.6V7.45c0-.4.19-.77.48-1.01Z"
    />,
  )

export const LockIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M12 2.2a4.6 4.6 0 0 0-4.6 4.6v1.75h-.15A2.85 2.85 0 0 0 4.4 11.4v7.05a3.35 3.35 0 0 0 3.35 3.35h8.5a3.35 3.35 0 0 0 3.35-3.35V11.4a2.85 2.85 0 0 0-2.85-2.85H16.6V6.8A4.6 4.6 0 0 0 12 2.2Zm2.1 6.35V6.8a2.1 2.1 0 1 0-4.2 0v1.75h4.2Z"
    />,
  )

export const LogoutIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M9.4 3.9a3.4 3.4 0 0 0-3.4 3.4v9.4a3.4 3.4 0 0 0 3.4 3.4h3.35a1.25 1.25 0 0 0 0-2.5H9.4a.9.9 0 0 1-.9-.9V7.3a.9.9 0 0 1 .9-.9h3.35a1.25 1.25 0 0 0 0-2.5H9.4Zm6.9 2.9a1.25 1.25 0 1 1 1.77-1.77l4.15 4.15a1.25 1.25 0 0 1 0 1.77l-4.15 4.15a1.25 1.25 0 1 1-1.77-1.77l2-2.01H12.4a1.25 1.25 0 0 1 0-2.5h5.9l-2-2.02Z"
    />,
  )

export const ChartIcon = (props: IconProps) =>
  solid(
    props,
    <path d="M3.3 13.1a1.3 1.3 0 0 1 1.3 1.3v5.3a1.3 1.3 0 0 1-2.6 0v-5.3c0-.72.58-1.3 1.3-1.3Zm4.85-5.6a1.3 1.3 0 0 1 1.3 1.3v10.9a1.3 1.3 0 0 1-2.6 0V8.8c0-.72.58-1.3 1.3-1.3Zm4.85-4.2a1.3 1.3 0 0 1 1.3 1.3v15.1a1.3 1.3 0 0 1-2.6 0V4.6c0-.72.58-1.3 1.3-1.3Zm4.85 7.4a1.3 1.3 0 0 1 1.3 1.3v7.7a1.3 1.3 0 0 1-2.6 0V12c0-.72.58-1.3 1.3-1.3Z" />,
  )

export const BoxIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M10.86 2.28a2.9 2.9 0 0 1 2.28 0l7.1 2.9c.9.36 1.5 1.24 1.5 2.2v9.02a2.9 2.9 0 0 1-1.79 2.68l-6.6 2.75a2.9 2.9 0 0 1-2.24 0l-6.6-2.75A2.9 2.9 0 0 1 2.72 16.4V7.38c0-.96.6-1.84 1.5-2.2l6.64-2.9Zm.9 2.32a.4.4 0 0 0-.28 0l-1.9.78 8.03 3.28 1.9-.78a.28.28 0 0 0 0-.52l-7.75-2.76Zm4.7 5.34-8.4-3.43-1.98.81a.28.28 0 0 0-.17.26v9.02a.4.4 0 0 0 .25.37l6.6 2.75a.4.4 0 0 0 .3 0V13.9c0-.69.56-1.25 1.25-1.25h2.15V9.94Z"
    />,
  )

export const ListIcon = (props: IconProps) =>
  solid(
    props,
    <path d="M4.4 5.4a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm0 5.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm0 5.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM9.4 5.65h11.35a1.25 1.25 0 0 1 0 2.5H9.4a1.25 1.25 0 0 1 0-2.5Zm0 5.2h11.35a1.25 1.25 0 0 1 0 2.5H9.4a1.25 1.25 0 0 1 0-2.5Zm0 5.2h11.35a1.25 1.25 0 0 1 0 2.5H9.4a1.25 1.25 0 0 1 0-2.5Z" />,
  )

export const SettingsIcon = (props: IconProps) =>
  solid(
    props,
    <path
      fillRule="evenodd"
      d="M11.08 2.25c-.92 0-1.7.66-1.85 1.57l-.18 1.07c-.02.12-.11.26-.3.35a7.5 7.5 0 0 0-.98.57c-.17.11-.34.12-.45.08L6.3 5.5a1.88 1.88 0 0 0-2.28.82l-.92 1.6a1.88 1.88 0 0 0 .43 2.38l.84.7c.1.07.17.22.15.42a7.6 7.6 0 0 0 0 1.14c.02.2-.06.36-.15.43l-.84.7a1.88 1.88 0 0 0-.43 2.38l.92 1.6a1.88 1.88 0 0 0 2.28.81l1.02-.38c.12-.04.29-.03.45.09.31.21.64.4.99.57.18.09.28.23.3.35l.17 1.07c.15.9.94 1.57 1.85 1.57h1.85c.91 0 1.7-.66 1.85-1.57l.17-1.07c.02-.12.12-.26.3-.35.35-.17.68-.36.99-.57.16-.12.33-.13.45-.09l1.02.38a1.88 1.88 0 0 0 2.28-.82l.92-1.6a1.88 1.88 0 0 0-.43-2.38l-.84-.7c-.1-.07-.17-.22-.15-.42a7.6 7.6 0 0 0 0-1.14c-.02-.2.06-.36.15-.43l.84-.7c.71-.58.9-1.59.43-2.38l-.92-1.6a1.88 1.88 0 0 0-2.28-.82l-1.02.38c-.12.04-.28.03-.45-.08a7.5 7.5 0 0 0-.98-.57c-.19-.09-.28-.23-.3-.35l-.18-1.07a1.88 1.88 0 0 0-1.85-1.57h-1.84ZM12 15.38a3.38 3.38 0 1 0 0-6.75 3.38 3.38 0 0 0 0 6.75Z"
    />,
  )
