import { IconButton, Tooltip } from '@chakra-ui/react'
import { SVGProps, useState } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

interface ButtonsNavigationsProps {
  title: string
  Icon: ({ strokeColor, ...props }: IconProps) => JSX.Element
  check: boolean
  onClick: () => void
}

export const ButtonsNavigations = ({
  title,
  Icon,
  check,
  onClick,
}: ButtonsNavigationsProps) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <Tooltip
      hasArrow
      label={title}
      placement="right"
      bg="white"
      color="black.100"
      boxShadow=" 0px 0px 3px 2px rgba(208, 224, 255, 1)"
      borderRadius='10px'
    >
      <IconButton
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        isRound={true}
        aria-label="title"
        icon={
          <Icon
            strokeColor={check && !isHovered ? 'white' : 'rgba(55, 54, 69, 1)'}
          />
        }
        borderRadius="20px"
        background={check ? 'blue.500' : 'white'}
        boxShadow={check ? 'inset 0px 0px 10px 1px rgba(97, 198, 255, 1)' : ''}
        _hover={{
          color: 'black',
          background: 'white',
          boxShadow: ' 0px 0px 3px 2px rgba(208, 224, 255, 1)',
        }}
        onClick={onClick}
      />
    </Tooltip>
  )
}
