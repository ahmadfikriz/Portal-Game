import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { of } from 'rxjs';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':file')
  async getFile(@Param('file') file: string, @Res() res) {
    return of(res.sendFile(join(process.cwd(), `file/${file}`)));
  }
}
