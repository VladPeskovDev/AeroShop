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
import axios from 'axios';
import type { FileType, EditFileType } from '../../types/FileTypes';

type FileCardTypes = {
  file: FileType;
  deleteHandler: (id: FileType['id']) => void;
  editHandler: (obj: EditFileType, file?: File) => void;
};

export default function FileCard({ file, deleteHandler, editHandler }: FileCardTypes): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [fileName, setFileName] = useState(file.file_name);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detailedFile, setDetailedFile] = useState<FileType | null>(null);

  // Обработка изменения файла для редактирования
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Обработчик сохранения редактирования
  const handleSave = () => {
    const editData = {
      id: file.id,
      data: { file_name: fileName },
    };
    editHandler(editData, selectedFile || undefined);
    onClose();
  };

  // Получение подробной информации о файле
  const fetchDetailedFile = async () => {
    try {
      const response = await axios.get(`/api/files/${file.id}`);
      setDetailedFile(response.data); // Сохраняем данные файла для отображения в модальном окне
      onDetailOpen(); // Открываем модальное окно
    } catch (error) {
      console.error('ошибка при получении подробной информации', error);
    }
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
            <Button onClick={fetchDetailedFile} variant="outline" colorScheme="blue">
              Подробнее
            </Button>
            <a href={`/api/files/download/${file.id}`} download>
              <Button variant="outline" colorScheme="green">
                Скачать
              </Button>
            </a>
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

      {/* Модальное окно для отображения подробной информации о файле */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Подробная информация о файле</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailedFile ? (
              <Stack spacing={3}>
                <Text>Имя файла: {detailedFile.file_name}</Text>
                <Text>Расширение: {detailedFile.extension}</Text>
                <Text>MIME-тип: {detailedFile.mime_type}</Text>
                <Text>Размер файла: {detailedFile.size}</Text>
                <Text>Дата загрузки: {new Date(detailedFile.upload_date).toLocaleString()}</Text>
                <Image src={`/api/${detailedFile.file_path}`} alt={detailedFile.file_name} />
              </Stack>
            ) : (
              <Text>Загрузка данных...</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onDetailClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
