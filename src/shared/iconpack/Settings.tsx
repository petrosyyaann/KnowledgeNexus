import { SVGProps } from 'react'

interface SettingsProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const Settings = ({
  strokeColor = '#161F29',
  ...props
}: SettingsProps) => (
  <svg
    {...props}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.86 13.9026H15.75M3.51 9L2.25 9.03303M3.51 9C3.51 9.99411 4.31589 10.8 5.31 10.8C6.30411 10.8 7.11 9.99411 7.11 9C7.11 8.00589 6.30411 7.2 5.31 7.2C4.31589 7.2 3.51 8.00589 3.51 9ZM7.62673 9.03308H15.75M9.60072 4.16343L2.25 4.16343M15.75 4.16343H13.86M2.25 13.9026H9.60072M13.41 13.95C13.41 14.9441 12.6041 15.75 11.61 15.75C10.6159 15.75 9.81 14.9441 9.81 13.95C9.81 12.9559 10.6159 12.15 11.61 12.15C12.6041 12.15 13.41 12.9559 13.41 13.95ZM13.41 4.05C13.41 5.04411 12.6041 5.85 11.61 5.85C10.6159 5.85 9.81 5.04411 9.81 4.05C9.81 3.05589 10.6159 2.25 11.61 2.25C12.6041 2.25 13.41 3.05589 13.41 4.05Z"
      stroke={strokeColor}
      strokeWidth="1.125"
      strokeLinecap="round"
    />
  </svg>
)
