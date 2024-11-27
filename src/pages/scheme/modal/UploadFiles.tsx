import { useState } from 'react'
import { Box, Input, VStack, Spinner, Text, Icon } from '@chakra-ui/react'
import { postFiles } from 'entities/workflow/api'
import { Upload } from 'shared/iconpack'

type UploadFilesProps = {
  value: string[]
  onChange: (newValue: string[]) => void
}

export const UploadFiles = ({ value, onChange }: UploadFilesProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(value || [])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files) return

    setIsLoading(true)

    for (const file of Array.from(files)) {
      try {
        const response = await postFiles(file)
        const fileUrl = response.data.s3_path
        setUploadedUrls((prev) => {
          const updatedUrls = [...prev, fileUrl]
          onChange(updatedUrls)
          return updatedUrls
        })
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    setIsLoading(false)
  }

  return (
    <Box>
      <VStack spacing={4}>
        <Box
          position="relative"
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="md"
          p={4}
          textAlign="center"
          _hover={{ borderColor: 'blue.400' }}
        >
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            opacity="0"
            cursor="pointer"
          />
          <Box>
            <Icon as={Upload} boxSize={8} color="blue.400" mb={2} />
            <Text fontSize="md" color="gray.600">
              {isLoading ? 'Загрузка...' : 'Кликни или перемести для загрузки'}
            </Text>
          </Box>
        </Box>
        {isLoading && <Spinner />}
        <VStack spacing={2} align="start" width="100%">
          {uploadedUrls.map((url, index) => (
            <Box
              key={index}
              p={2}
              borderWidth={1}
              borderRadius="md"
              width="100%"
            >
              <Text>
                Файл {index + 1}: {url}
              </Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  )
}
