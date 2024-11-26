import { SVGProps } from 'react'

interface PlusProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const Plus = ({ strokeColor = '#161F29', ...props }: PlusProps) => (
  <svg
    {...props}
    width={props.width || '20'}
    height={props.height || '20'}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.66675 9.99935H13.3334M10.0001 6.66602L10.0001 13.3327"
      stroke={strokeColor}
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
)
