import React from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
} from '@chakra-ui/react'

interface FormFieldProps {
  label?: string
  value: string | number | string[] | boolean
  onChange: (value: string | number | string[] | boolean) => void
  type?: 'text' | 'number' | 'select' | 'checkbox'
  options?: string[]
}

const FormField = ({
  label,
  value,
  onChange,
  type = 'text',
  options,
}: FormFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      onChange(parseInt(e.target.value))
    } else if (type === 'checkbox') {
      onChange(e.target.checked) // Для чекбокса обновляем значение как true/false
    } else {
      onChange(e.target.value)
    }
  }

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      {type === 'select' ? (
        <Select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        >
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : type === 'checkbox' ? (
        <Checkbox
          mb={5}
          isChecked={value as boolean} // Для чекбокса привязываем состояние к значению
          onChange={handleChange}
        >
          {label}
        </Checkbox>
      ) : (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Input type={type} value={value || ''} onChange={handleChange} />
      )}
    </FormControl>
  )
}

export default FormField
