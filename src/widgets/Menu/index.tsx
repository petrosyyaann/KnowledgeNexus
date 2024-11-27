import { Flex, useToast } from '@chakra-ui/react'
import { logout } from 'entities/user/api'
import { useMatch, useNavigate } from 'react-router-dom'
import { Logout, Tasks } from 'shared/iconpack'
import { ButtonsNavigations } from 'shared/ui'
import { Aside } from 'shared/ui/aside'

function Menu() {
  const isLogin = useMatch('/')
  const isRegistration = useMatch('/registration')
  const isKnowledgeBase = useMatch('/home')
  const navigate = useNavigate()
  const toast = useToast()
  if (isLogin || isRegistration) return null
  return (
    <Aside>
      <Flex flexDir={'column'} justifyContent={'space-between'} h={'100%'}>
        <ButtonsNavigations
          title={'Базы знаний'}
          Icon={Tasks}
          check={!!isKnowledgeBase}
          onClick={() => navigate('/home')}
        />
        <ButtonsNavigations
          title={'Выход'}
          Icon={Logout}
          check={false}
          onClick={() => {
            localStorage.removeItem('refresh')
            navigate('/')
            logout().catch(() => {
              toast({
                position: 'bottom-right',
                title: 'Ошибка',
                description: 'Не удалось выполнить выход',
                status: 'error',
                duration: 9000,
                isClosable: true,
                variant: 'top-accent',
              })
            })
          }}
        />
      </Flex>
    </Aside>
  )
}

export { Menu }
