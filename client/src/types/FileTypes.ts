import type { z } from 'zod';
import type { FileSchema } from '../utils /validators';


export type FileType = z.infer<typeof FileSchema>;

export type FileDataType = Omit<FileType, 'id'>;

export type ApiResponce = FileType[];

export type EditFileType = {
    id: number;
    data: FileDataType;
};