import { ReactNode } from 'react'
import { ReactStrictModeProvider } from './ReactStrictModeProvider'
import { RouterProvider } from './RouterProvider'
import { CustomChakraProvider } from './ChakraProvider'

interface CombinedProvidersProps {
  children: ReactNode
}

export const CombinedProviders = ({ children }: CombinedProvidersProps) => {
  return (
    <ReactStrictModeProvider>
      <CustomChakraProvider>
          <RouterProvider>{children}</RouterProvider>
      </CustomChakraProvider>
    </ReactStrictModeProvider>
  )
}
