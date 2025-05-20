// food-item.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Query, UseInterceptors, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, HttpStatus, NotFoundException, Res } from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from '../auth/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadFilesDto } from './dto/upload-files.dto';
import { File } from 'multer';
import { Response } from 'express'; // Import Response type

const storage = diskStorage({
  destination: './uploads/food-item-media',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    callback(null, filename);
  },
});

@Controller('food-items')
export class FoodItemController {
  constructor(private readonly foodItemService: FoodItemService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  create(@Body() createFoodItemDto: CreateFoodItemDto) {
    return this.foodItemService.create(createFoodItemDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.foodItemService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.foodItemService.findById(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: number, @Body() updateFoodItemDto: CreateFoodItemDto) {
    return this.foodItemService.update(+id, updateFoodItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number) {
    await this.foodItemService.remove(+id);
    return { message: `Food-item with ID ${id} has been deleted.` };
  }

  @Post('upload/:id/media')
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FilesInterceptor('files', undefined, { storage }))
  async uploadFiles(
    @Param('id') id: number,
    @Body() uploadFilesDto: UploadFilesDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^(application\/pdf|image\/(jpeg|png|jpg))$/ }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    files: File[],
  ) {
    if (!files || files.length === 0) {
      return { message: 'No files uploaded.' };
    }

    const filePaths = files.map((file) => file.path);
    await this.foodItemService.addMedia(id, filePaths);

    return { message: 'Files uploaded successfully!', filePaths };
  }

  @Get('pdf/:filename') // New endpoint to serve PDF
  async getFoodItemPdf(@Param('filename') filename: string, @Res() res: Response) {
    const pdfBuffer = await this.foodItemService.getFoodItemPdfBuffer(filename);

    if (!pdfBuffer) {
      throw new NotFoundException('PDF file not found');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=' + filename, // 'inline' to view in browser/Postman, 'attachment' to download
    });

    res.send(pdfBuffer);
  }
}