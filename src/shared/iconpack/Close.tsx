import { SVGProps } from 'react'

interface CloseProps extends SVGProps<SVGSVGElement> {
    strokeColor?: string
  }

export const Close = ({ strokeColor = '#161F29', ...props }: CloseProps) => (
    <svg 
    width="8" 
    height="8" 
    viewBox="0 0 8 8" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M1.14215 6.79913L6.799 1.14228M1.14215 1.14228L6.799 6.79913" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>    
)
