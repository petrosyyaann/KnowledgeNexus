import { SVGProps } from 'react'

interface ChevronProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const Chevron = ({
  strokeColor = '#161F29',
  ...props
}: ChevronProps) => (
  <svg
    width="16"
    height="26"
    viewBox="0 0 16 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.66658 10.2222L7.99992 6.88892L11.3333 10.2222"
      stroke="#7984F1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.3334 15.778L8.00008 19.1113L4.66675 15.778"
      stroke="#7984F1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)
