import { chakra } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const Aside = ({ children }: { children: ReactNode }) => (
  <chakra.aside
    pt="25px"
    mt="55px"
    pb="25px"
    w="100%"
    maxW="76px"
    display="flex"
    flexDir="column"
    alignItems="center"
    borderRadius="20px"
    border="1px solid transparent" // Прозрачный бордер
    position="fixed"
    left="20px"
    top="30px"
    bottom="30px"
    boxShadow="0 0 20px 5px rgba(255, 255, 255, 0.5)" // Белая полупрозрачная тень
  >
    {children}
  </chakra.aside>
)
