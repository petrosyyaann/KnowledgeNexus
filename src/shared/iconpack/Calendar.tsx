import { SVGProps } from 'react'

interface CalendarProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const Calendar = ({ strokeColor = '#161F29', ...props }: CalendarProps) => (
  <svg
    width="15"
    height="16"
    viewBox="0 0 15 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.42756 1.25V3.13531M10.3224 1.25V3.13531M5.16442 10.488H7.375M5.16442 8.22564H9.58558M1.24995 10.4364C0.916682 8.98228 0.916682 7.469 1.24995 6.01492C1.71143 4.00149 3.24755 2.42938 5.21489 1.9571C6.63568 1.61601 8.11432 1.61601 9.53511 1.95709C11.5025 2.42938 13.0386 4.00149 13.5 6.01493C13.8333 7.469 13.8333 8.98228 13.5 10.4364C13.0386 12.4498 11.5025 14.0219 9.53511 14.4942C8.11432 14.8353 6.63568 14.8353 5.21489 14.4942C3.24755 14.0219 1.71143 12.4498 1.24995 10.4364Z"
      stroke={strokeColor}
      strokeWidth="1.125"
      strokeLinecap="round"
    />
  </svg>
)

