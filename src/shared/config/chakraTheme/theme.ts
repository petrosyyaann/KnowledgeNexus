import { extendTheme } from '@chakra-ui/react'
import 'shared/config/fonts/fonts.css'
import {
  ButtonTheme,
  InputTheme,
  TextTheme,
} from 'shared/ui'

export const theme = extendTheme({
  components: {
    Button: ButtonTheme,
    Input: InputTheme,
    Text: TextTheme,
  },
  fonts: {
    heading: 'EuclidFlex, EuclidFlex, EuclidFlex, EuclidFlex',
    body: 'EuclidFlex, EuclidFlex, EuclidFlex, EuclidFlex',
  },
  styles: {
    global: {
      body: {
        height: '100vh',
        width: '100vw',
        maxHeight: '100vh',
        maxWidth: '100vw',
        overflow: 'hidden',
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
      '&::-webkit-scrollbar': {
        width: '0',
      },
      '&::-webkit-scrollbar-track': {
        width: '0',
      },
    },
  },
  colors: {
    black: {
      100: '#161F29',
    },
    blue: {
      100: '#EBEDFD',
      200: '#DBDEFF',
      300: '#BDC3FF',
      400: '#949DF7',
      500: '#7984F1',
    },
    mallow: {
      100: '#C6EAFF',
      200: '#9CDBFF',
      300: '#83D2FF',
      400: '#61C6FF',
    },
    gray: {
      100: '#F5F4FC',
      200: '#D7D5E9',
      300: '#9896A9',
      400: '#5F5E6E',
      500: '#464555',
      600: '#373645',
    },
    red: {
      400: '#F994D0',
      500: '#F179C1',
    },
  },
})
