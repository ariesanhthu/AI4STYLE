import { ImageEntity } from "../image.entity";
import { PaginationCursorQueryDto } from "../../shared/dtos";

export interface IImageRepository {
  create(newEntity: ImageEntity): Promise<ImageEntity>;
  findById(id: string): Promise<ImageEntity | null>;
  findAll(query: PaginationCursorQueryDto): Promise<ImageEntity[]>;
  delete(id: string): Promise<boolean>;
  toEntity(raw: any): ImageEntity;
}