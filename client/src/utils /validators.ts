import { z } from 'zod';

// Схема для отдельного файла
export const FileSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable().optional(),
  file_name: z.string(),
  extension: z.string(),
  mime_type: z.string(),
  upload_date: z.string(),
  file_path: z.string(),
});

// Схема для ответа с сервера
export const FileResponseSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  files: z.array(FileSchema), // Массив файлов
});

export type FileType = z.infer<typeof FileSchema>;
export type FileResponseType = z.infer<typeof FileResponseSchema>;
