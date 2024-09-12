import { useEffect } from 'react';
import { createFileThunk, deleteFileThunk, editFileThunk, getFilesThunk } from '../../redux/files/FileAsyncActions';
import type { EditFileType, FileType } from '../../types/FileTypes';
import { useAppDispatch, useAppSelector } from './reduxHooks';

export default function useFiles(): {
  files: FileType[];
  FilesSubmitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  deleteHandler: (id: FileType['id']) => void;
  editHandler: (obj: EditFileType, file?: File) => void;
} {
  const files = useAppSelector((state) => state.files.data);
  const dispatch = useAppDispatch();

  // Загружаем файлы при монтировании компонента
  useEffect(() => {
    void dispatch(getFilesThunk());
  }, [dispatch]);

  const FilesSubmitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Отправляем запрос на создание файла
    await dispatch(createFileThunk(formData));

    // После добавления файла, обновляем список файлов
    void dispatch(getFilesThunk()); // Загружаем обновленный список файлов
  };

  const deleteHandler = async (id: FileType['id']): Promise<void> => {
    await dispatch(deleteFileThunk(id));
    void dispatch(getFilesThunk()); // Обновляем список после удаления
  };

  const editHandler = async (obj: EditFileType, file?: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file_name', obj.data.file_name);
    if (file) formData.append('file', file);

    await dispatch(editFileThunk({ id: obj.id, data: formData }));
    void dispatch(getFilesThunk()); // Обновляем список после редактирования
  };

  return { files, FilesSubmitHandler, deleteHandler, editHandler };
}
