import React, { useState } from 'react';
import { Box, Button, Input, Stack } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

type PropsType = {
  FilesSubmitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function FileForm({ FilesSubmitHandler }: PropsType): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const wrappedFilesSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    FilesSubmitHandler(e);
    closeModal();
  };

  return (
    <>
      <Button onClick={openModal} colorScheme="purple" mt={8} mb={8}>
        Добавить файл
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Добавить новый файл</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box onSubmit={wrappedFilesSubmitHandler} as="form" mt={3}>
              <Stack spacing={3}>
                <Input type="file" name="file" placeholder="Загрузить файл" accept="image/*" size="md" />
                <Button type="submit" colorScheme="green">
                  Добавить файл
                </Button>
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
