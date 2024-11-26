import { SVGProps } from 'react'

interface EditProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const Edit = ({ strokeColor = '#161F29', ...props }: EditProps) => (
  <svg
    {...props}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4.16675L10 13.3334M10 13.3334L13.3334 9.50989M10 13.3334L6.66671 9.50989M5.83337 16.2501H14.1667"
      stroke={strokeColor}
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)
