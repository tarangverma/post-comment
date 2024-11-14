import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { PostsService } from 'src/posts/posts.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostsService) {}
    
    @Get()
    findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postService.findOne(id);
    }

    @Post()
    create(@Body() CreatePostDto: CreatePostDto){
        return this.postService.create(CreatePostDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() UpdatePostDto: UpdatePostDto) {
        return this.postService.update(id, UpdatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.postService.remove(id);
    }

}
