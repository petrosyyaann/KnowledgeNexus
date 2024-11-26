import { Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const DefaultLayout = ({ children }: { children: ReactNode }) => 
  {return(
  <Flex
    w="100vw"
    h="100vh"
    bg="blue.100"
    direction="column"
    justify="center"
  >
    {children}
  </Flex>
)}
