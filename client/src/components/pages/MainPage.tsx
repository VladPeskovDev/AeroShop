import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import FileCard from '../ui/FileCard';
import FileForm from '../ui/FileForm';
import useFiles from '../hooks/useFiles';

export default function MainPage(): JSX.Element {
  const { FilesSubmitHandler, files, deleteHandler, editHandler } = useFiles();

  // Отладка: Выводим файлы
  console.log('Files to render:', files);

  return (
    <>
      <FileForm FilesSubmitHandler={FilesSubmitHandler} />
      <SimpleGrid columns={2} spacing={5}>
        {files.length > 0 ? (
          files.map((el) => (
            <FileCard
              file={el}
              key={el.id}
              deleteHandler={deleteHandler}
              editHandler={editHandler}
            />
          ))
        ) : (
          <p>No files to display</p>
        )}
      </SimpleGrid>
    </>
  );
}
