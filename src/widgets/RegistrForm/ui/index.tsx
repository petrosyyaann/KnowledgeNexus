import { useState } from 'react'
import { chakra, FormControl, FormErrorMessage } from '@chakra-ui/react'
import { Button, Flex, Input, PasswordInput } from 'shared/ui'
import { LoginLogo } from 'shared/iconpack'
import { useRegistrationForm } from '../lib'

export const RegistrationForm = () => {
  const [step, setStep] = useState(1)
  const formik = useRegistrationForm()

  return (
    <chakra.form onSubmit={formik.handleSubmit}>
      <Flex
        bgColor={'white'}
        borderRadius={'20px'}
        w={'673px'}
        h={'500px'}
        flexDirection={'column'}
        alignItems={'center'}
        justify={'center'}
        gap={'16px'}
      >
        <LoginLogo />

        {step === 1 && (
          <Flex
            flexDirection={'column'}
            w={'266px'}
            gap={'16px'}
            align={'center'}
          >
            <FormControl
              isRequired
              isInvalid={
                !!formik.touched.firstName && !!formik.errors.firstName
              }
            >
              <Input
                id="firstName"
                name="firstName"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                w={'100%'}
                placeholder="Введите имя"
              />
              <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={!!formik.touched.lastName && !!formik.errors.lastName}
            >
              <Input
                id="lastName"
                name="lastName"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                w={'100%'}
                placeholder="Введите фамилию"
              />
              <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={!!formik.touched.email && !!formik.errors.email}
            >
              <Input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                w={'100%'}
                placeholder="Введите email"
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>

            <Button disabled={!formik.isValid} onClick={() => setStep(2)}>
              Далее
            </Button>
          </Flex>
        )}

        {step === 2 && (
          <Flex
            flexDirection={'column'}
            w={'266px'}
            gap={'16px'}
            align={'center'}
          >
            <FormControl
              isRequired
              isInvalid={!!formik.touched.username && !!formik.errors.username}
            >
              <Input
                id="username"
                name="username"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                w={'100%'}
                placeholder="Введите username"
              />
              <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={!!formik.touched.password && !!formik.errors.password}
            >
              <PasswordInput
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={
                !!formik.touched.confirmPassword &&
                !!formik.errors.confirmPassword
              }
            >
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                placeholder="Повторите пароль"
              />
              <FormErrorMessage>
                {formik.errors.confirmPassword}
              </FormErrorMessage>
            </FormControl>

            <Button disabled={!formik.isValid} type="submit">
              Зарегистрироваться
            </Button>
          </Flex>
        )}
      </Flex>
    </chakra.form>
  )
}
