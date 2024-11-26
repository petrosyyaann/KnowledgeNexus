interface NameProps {
    surname?: string
    name?: string
    patronymic?: string
  }
  
  export const formatName = ({
    surname,
    name,
    patronymic,
  }: NameProps): string => {
    const formattedName = `${surname || ''} ${(name || '').charAt(0)}.${
        patronymic ? patronymic.charAt(0) + '.' : ''
    }`
    return formattedName.trim()
}

export function formatPhoneNumber(phoneNumber: string): string {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
  
    if (match) {
      return `${match[1]}(${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
    }
  
    return phoneNumber
}