import React from 'react'
import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react'

interface FormFieldProps {
  label: string
  value: string | number | string[]
  onChange: (value: string | number | string[]) => void
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
    onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)
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
      ) : (
        <Input type={type} value={value} onChange={handleChange} />
      )}
    </FormControl>
  )
}

export default FormField
