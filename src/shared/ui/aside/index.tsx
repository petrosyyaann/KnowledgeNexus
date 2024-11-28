import { chakra } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const Aside = ({ children }: { children: ReactNode }) => (
  <chakra.aside
    mt="55px"
    pb="25px"
    pr="35px"
    w="100%"
    maxW="76px"
    display="flex"
    flexDir="column"
    alignItems="center"
    borderRadius="20px"
    position="fixed"
    left="20px"
    top="30px"
    bottom="30px"
  >
    {children}
  </chakra.aside>
)
