import { SVGProps } from 'react'

interface EditTextProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const EditText = ({
  strokeColor = '#CBD1DE',
  ...props
}: EditTextProps) => (
  <svg
    {...props}
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.5 9.63608C14.682 10.2421 12.2579 7.81804 12.8639 6M13.6109 5.25306L9.69403 9.16988C7.99123 10.8727 6.78322 13.0063 6.19917 15.3425L6.00991 16.0995C5.95094 16.3354 6.1646 16.5491 6.40049 16.4901L7.15752 16.3008C9.49375 15.7168 11.6273 14.5088 13.3301 12.806L17.2469 8.88914C17.7291 8.40697 18 7.753 18 7.0711C18 5.65112 16.8489 4.5 15.4289 4.5C14.747 4.5 14.093 4.77088 13.6109 5.25306Z"
      stroke={strokeColor}
      strokeWidth="1.5"
    />
    <path
      d="M19 20.5H5"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
