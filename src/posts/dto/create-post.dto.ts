import { IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    readonly title: string;
    @IsString()
    readonly content: string;
    @IsString({each: true})
    readonly comments: string[];
}
