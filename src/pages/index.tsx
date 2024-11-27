import { ProtectedRoute } from 'app/lib/ProtectedRoute'
import { lazy } from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import { LoginLogo } from 'shared/iconpack'
import { DefaultLayout, Flex, LoginLayout, Text } from 'shared/ui'
import { Menu } from 'widgets/Menu'

const HomePage = lazy(() => import('./home'))
const LoginPage = lazy(() => import('./login'))
const RegistrationPage = lazy(() => import('./registration'))

export default function Routing() {
  const isRegistration = useMatch('/registration')
  const isLogin = useMatch('/')
  const refresh = localStorage.getItem('refresh')
  return (
    <DefaultLayout>
      {!(isRegistration || isLogin) && refresh && (
        <Flex
          w="100%"
          h="90px"
          flexDirection="column"
          justifyContent="space-around"
        >
          <Flex ml="17px">
            <LoginLogo />
          </Flex>
        </Flex>
      )}
      <Flex w="100vw" h="100%">
        {!(isRegistration || isLogin) && refresh && (
          <Flex h="100%" w="85px">
            <Menu />
          </Flex>
        )}
        <Routes>
          <Route
            path={'/home'}
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/'}
            element={
              <LoginLayout>
                <LoginPage />
              </LoginLayout>
            }
          />
          <Route
            path={'/registration'}
            element={
              <LoginLayout>
                <RegistrationPage />
              </LoginLayout>
            }
          />
          <Route
            path={'*'}
            element={
              <Flex
                w="100%"
                h="100%"
                justifyContent="center"
                alignItems="center"
              >
                <Text>404 page</Text>
              </Flex>
            }
          />
        </Routes>
      </Flex>
    </DefaultLayout>
  )
}
