import { FileResponseSchema, FileSchema } from "../utils /validators";
import type { ApiResponce, FileType, FileDataType } from "../types/FileTypes";
import apiInstance from "./apiInstance";

class FileService {
  async getFiles(): Promise<ApiResponce> {
    const { data } = await apiInstance.get('/files/list');
    return FileResponseSchema.parse(data).files; // Валидируем и возвращаем только массив файлов
  }

  async addFiles(obj: FileDataType): Promise<FileType> {
    const { data } = await apiInstance.post<FileType>('/files/upload', obj);
    return FileSchema.parse(data);
  }

  async deleteFile(id: number): Promise<void> {
    await apiInstance.delete(`/files/delete/${id}`);
  }

  async editFile(id: number, obj: FileDataType): Promise<FileType> {
    const { data } = await apiInstance.put<FileType>(`/files/update/${id}`, obj);
    return FileSchema.parse(data);
  }
}

export default new FileService(apiInstance);
