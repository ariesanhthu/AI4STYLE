import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { UploadService } from "./upload.service";
import { ApiZodBody, ApiZodQuery, Permissions, ZodBody, ZodQuery } from "../shared/decorators";
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from "../shared/enums";
import { getListImageSchema, type GetListImageDto, bulkDeleteImageSchema, type BulkDeleteImageDto } from "./dtos";

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.UPLOAD}`)
@ApiBearerAuth()
@ApiSecurity("x-api-key")
@Permissions(EPermission.IMAGE_MANAGEMENT)
@Controller("admin/upload")
export class UploadAdminController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: "Upload an image to Cloudinary" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Title of the image",
          example: "Product Image",
        },
        file: {
          type: "string",
          format: "binary",
          description: "Image file to upload",
        },
      },
      required: ["title", "file"],
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  @Post("image")
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body("title") title: string,
  ) {
    return this.uploadService.uploadImage(file, title);
  }

  @ApiOperation({ summary: "Bulk upload images to Cloudinary (max 10 files)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        titles: {
          type: "string",
          description: "Comma-separated titles for images",
          example: "Image 1,Image 2,Image 3",
        },
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: "Multiple image files to upload (max 10)",
        },
      },
      required: ["files"],
    },
  })
  @UseInterceptors(FilesInterceptor("files", 10))
  @Post("images/bulk")
  async bulkUploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB per file
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif|webp)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body("titles") titlesString?: string,
  ) {
    const titles = titlesString ? titlesString.split(",").map(t => t.trim()) : [];
    return this.uploadService.bulkUploadImages(files, titles);
  }

  @ApiOperation({ summary: "Get list of images with pagination" })
  @ApiZodQuery(getListImageSchema)
  @Get()
  async getListImages(@ZodQuery(getListImageSchema) query: GetListImageDto) {
    return this.uploadService.getListImages(query);
  }

  @ApiOperation({ summary: "Get image by ID" })
  @ApiParam({
    name: "id",
    description: "Image ID",
    type: String,
  })
  @Get(":id")
  async getImageById(@Param("id") id: string) {
    return this.uploadService.getImageById(id);
  }

  @ApiOperation({ summary: "Delete image from Cloudinary and database" })
  @ApiParam({
    name: "id",
    description: "Image ID",
    type: String,
  })
  @Delete(":id")
  async deleteImage(@Param("id") id: string) {
    return this.uploadService.deleteImage(id);
  }

  @ApiOperation({ summary: "Bulk delete images from Cloudinary and database (max 50)" })
  @ApiZodBody(bulkDeleteImageSchema)
  @Post("images/bulk-delete")
  async bulkDeleteImages(@ZodBody(bulkDeleteImageSchema) body: BulkDeleteImageDto) {
    return this.uploadService.bulkDeleteImages(body.ids);
  }
}
