import { ButtonProps, Button as ChakraButton } from '@chakra-ui/react'

export const Button = ({ children, ...props }: ButtonProps) => (
  <ChakraButton
    variant={props.variant ? props.variant : 'baseStyle'}
    {...props}
  >
    {children}
  </ChakraButton>
)