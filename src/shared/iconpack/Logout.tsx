import { SVGProps } from 'react'

interface LogoutProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const Logout = ({ strokeColor = '#6D9AF2', ...props }: LogoutProps) => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 16 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.65527 9.5L1.65527 9.5M1.65527 9.5L4.15527 7M1.65527 9.5L4.15527 12"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.655 17.7006C8.86823 17.7006 11.0903 17.9205 12.6553 16.3555C14.2203 14.7905 15 12.2385 15 9.35561C15 6.47259 14.2201 3.92046 12.6551 2.35547C11.0902 0.790478 8.86823 1.01061 6.655 1.01061"
      stroke={strokeColor}
      strokeWidth="1.31"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
