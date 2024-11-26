import { Flex } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const LoginLayout = ({ children }: { children: ReactNode }) => (
  <Flex
    w="100vw"
    h="100vh"
    direction="column"
    justify="center"
    align="center"
    style={{ position: 'relative', overflow: 'hidden' }}
    backgroundColor={'#F6F9FF'}
    zIndex={0}
  >
    <div
      style={{
        position: 'absolute',
        bottom: '-5%',
        left: '-5%',
        width: '252px',
        height: '252px',
        background: '#FFD2ED',
        filter: 'blur(70px)',
        zIndex: 0,
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: '+30%',
        right: '+15%',
        width: '252px',
        height: '252px',
        background: '#FFD2ED',
        filter: 'blur(70px)',
        zIndex: -1,
      }}
    />
    {children}
  </Flex>
)
