import { SVGProps } from 'react'

interface CompareProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const Compare = ({
  strokeColor = '#373645',
  ...props
}: CompareProps) => (
  <svg
    {...props}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 2.5L10 17.5M12.259 16.1573C14.3163 15.6934 15.9227 14.1492 16.4053 12.1715C16.7538 10.7432 16.7538 9.25677 16.4053 7.82849C15.9227 5.85079 14.3163 4.30658 12.259 3.84267M10 3.59141C9.24202 3.59141 8.484 3.67516 7.7411 3.84267C5.68375 4.30658 4.07735 5.85078 3.59476 7.82849C3.24624 9.25676 3.24624 10.7432 3.59476 12.1715C4.07735 14.1492 5.68375 15.6934 7.7411 16.1573C8.484 16.3248 9.24202 16.4086 10 16.4086"
      stroke={strokeColor}
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
)
