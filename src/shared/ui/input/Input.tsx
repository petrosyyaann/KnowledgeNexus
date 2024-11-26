import { Input as ChakraInput, InputProps } from '@chakra-ui/react'

export const Input = ({
  color = 'black.100',
  bg = 'transparent',
  borderColor = 'gray.500',
  _placeholder = { color: 'gray.400' },
  _focus = {
    borderColor: 'blue.300',
    boxShadow: 'none',
    bgColor: 'blue.100',
  },
  ...props
}: InputProps) => (
  <ChakraInput
    color={color}
    bg={bg}
    borderColor={borderColor}
    _placeholder={_placeholder}
    _focus={_focus}
    {...props}
  />
)
