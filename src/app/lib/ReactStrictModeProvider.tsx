import { ReactNode, StrictMode } from 'react'

interface ReactStrictModeProviderProps {
  children: ReactNode
}

export const ReactStrictModeProvider = ({
  children,
}: ReactStrictModeProviderProps) => <StrictMode>{children}</StrictMode>
