import { InputGroup, InputRightElement, useTheme } from '@chakra-ui/react'
import { Input } from '..'
import { useState } from 'react'
import { Eye, EyeOff } from 'shared/iconpack'

interface PasswordInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  value: string
  placeholder?: string
  id?: string
  name?: string
}

export const PasswordInput = ({
  onChange,
  onBlur,
  value,
  placeholder = 'Введите пароль',
  id = 'password',
  name = 'password',
}: PasswordInputProps) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false)

  const theme = useTheme()
  const black100 = theme.colors.black['100']

  const handleTogglePassword = () => {
    setPasswordVisibility((prev) => !prev)
  }

  const handleMouseDownPassword = () => {
    setPasswordVisibility(true)
  }

  const handleMouseUpPassword = () => {
    setPasswordVisibility(false)
  }

  return (
    <InputGroup>
      <Input
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        type={isPasswordVisible ? 'text' : 'password'}
        w={'100%'}
        placeholder={placeholder}
      />
      <InputRightElement cursor={'pointer'} width="3rem">
        {isPasswordVisible ? (
          <EyeOff onMouseUp={handleMouseUpPassword} color={black100} />
        ) : (
          <Eye
            onClick={handleTogglePassword}
            onMouseDown={handleMouseDownPassword}
            color={black100}
          />
        )}
      </InputRightElement>
    </InputGroup>
  )
}