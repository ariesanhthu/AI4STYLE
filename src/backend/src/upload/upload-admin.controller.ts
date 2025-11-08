import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
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
import { ApiZodQuery, Permissions } from "../shared/decorators";
import { ZodValidationPipe } from "../shared/pipes";
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from "../shared/enums";
import { getListImageSchema, type GetListImageDto, bulkDeleteImageSchema, type BulkDeleteImageDto } from "./dtos";
import z from "zod";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.UPLOAD}`)
@ApiBearerAuth()
@ApiSecurity("x-api-key")
@Permissions(EPermission.IMAGE_MANAGEMENT)
@Controller("admin/upload")
export class UploadAdminController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("image")
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

  @Post("images/bulk")
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

  @Get()
  @ApiOperation({ summary: "Get list of images with pagination" })
  @ApiZodQuery(getListImageSchema)
  @UsePipes(new ZodValidationPipe(getListImageSchema))
  async getListImages(@Query() query: GetListImageDto) {
    return this.uploadService.getListImages(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get image by ID" })
  @ApiParam({
    name: "id",
    description: "Image ID",
    type: String,
  })
  async getImageById(@Param("id") id: string) {
    return this.uploadService.getImageById(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete image from Cloudinary and database" })
  @ApiParam({
    name: "id",
    description: "Image ID",
    type: String,
  })
  async deleteImage(@Param("id") id: string) {
    return this.uploadService.deleteImage(id);
  }

  @Post("images/bulk-delete")
  @ApiOperation({ summary: "Bulk delete images from Cloudinary and database (max 50)" })
  @ApiBody({ schema: z.toJSONSchema(bulkDeleteImageSchema) as SchemaObject })
  @UsePipes(new ZodValidationPipe(bulkDeleteImageSchema))
  async bulkDeleteImages(@Body() body: BulkDeleteImageDto) {
    return this.uploadService.bulkDeleteImages(body.ids);
  }
}
