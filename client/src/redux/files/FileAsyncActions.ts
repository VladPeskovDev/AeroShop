import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import FileService from "../../services/FileService";
// eslint-disable-next-line import/no-duplicates
import type { EditFileType, FileDataType, FileType} from "../../types/FileTypes";
// eslint-disable-next-line import/no-duplicates
import { type ApiResponce } from "../../types/FileTypes";




// eslint-disable-next-line import/prefer-default-export
export const getFilesThunk = createAsyncThunk<FileType[]>(
    'files/getAll',
    async () => {
      const files = await FileService.getFiles(); // Возвращаем массив файлов
      return files;
    }
  );


export const createFileThunk = createAsyncThunk<FileType, FileDataType>('files/create',
    async (data) => {
    const file = await FileService.addFiles(data);
    return file;
    });
    

export const deleteFileThunk = createAsyncThunk<FileType['id'], FileType['id']>('files/delete',
    async (id) => {
        await FileService.deleteFile(id);
        return id;
});



export const editFileThunk = createAsyncThunk<FileType, EditFileType>(
    'files/edit',
    async ({ id, data }) => {
      const file = await FileService.editFile(id, data);
      return file;
    }
);  