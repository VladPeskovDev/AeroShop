import {
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { EditFileType, FileType } from '../../types/FileTypes';

type FileCardTypes = {
  file: FileType;
  deleteHandler: (id: FileType['id']) => void;
  editHandler: (obj: EditFileType, file?: File) => void;
};

export default function FileCard({ file, deleteHandler, editHandler }: FileCardTypes): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileName, setFileName] = useState(file.file_name);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]); // Сохраняем выбранный файл для отправки
    }
  };

  const handleSave = () => {
    const editData = {
      id: file.id,
      data: { file_name: fileName },
    };

    // Отправляем данные на сервер с новым файлом, если он был выбран
    editHandler(editData, selectedFile || undefined);
    onClose();
  };

  return (
    <>
      <Card maxW="sm" backgroundColor="rgba(212, 207, 207, 0.5)">
        <CardBody>
          <Stack mt="6" spacing="3">
            <Image
              src={`/api/${file.file_path}`}
              alt={file.file_name}
              objectFit="cover"
              height="200px"
              width="100%"
              borderTopLeftRadius="lg"
              borderTopRightRadius="lg"
            />
            <Heading size="md">{file.file_name}</Heading>
            <Text>{file.extension}</Text>
            <Text>{file.mime_type}</Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button onClick={onOpen} variant="outline" colorScheme="gray">
              Редактировать
            </Button>
            <Button onClick={() => deleteHandler(file.id)} variant="outline" colorScheme="red">
              Удалить
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>

      {/* Модальное окно для редактирования файла */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редактировать файл</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as="form">
              <Stack spacing={3}>
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Изменить имя файла"
                  size="md"
                />
                <Input type="file" onChange={handleFileChange} accept="image/*" size="md" />
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
