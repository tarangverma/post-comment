import { Injectable, NotFoundException } from '@nestjs/common';
import { post } from 'src/post/entities/post.entity';

@Injectable()
export class PostsService {
    private posts: post[] =[
        {
            id: 1,
            title: 'sun',
            content: 'first post',
            comments: []
        },
    ];

    findAll() {
        return this.posts;
    }

    findOne(id: string) {
        const posts = this.posts.find(item => item.id === +id );
        if(!posts) {
            throw new NotFoundException(`post with id:${id} not found`);
        }
        return posts;
    }

    create(createPostDto: any) {
        this.posts.push(createPostDto);
    }

    update(id: string, updatePostDto: any) {
        const exestingPost = this.findOne(id);
        if( exestingPost) {
            // update 
        }
    }

    remove(id: string) {
        const postIndex = this.posts.findIndex(item => item.id === +id);
        if ( postIndex >= 0) {
            this.posts.splice(postIndex, 1);
        }
    }
}
