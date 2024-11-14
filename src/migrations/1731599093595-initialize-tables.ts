import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeTables1731599093595 implements MigrationInterface {
  name = 'InitializeTables1731599093595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "isEdited" boolean NOT NULL DEFAULT false, "postId" uuid NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")); COMMENT ON COLUMN "comments"."text" IS 'The content of the comment'; COMMENT ON COLUMN "comments"."createdAt" IS 'Timestamp of comment creation'; COMMENT ON COLUMN "comments"."updatedAt" IS 'Timestamp of last update'; COMMENT ON COLUMN "comments"."userId" IS 'ID of the user who created the comment'; COMMENT ON COLUMN "comments"."isEdited" IS 'Indicates if the comment has been edited'`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "isEdited" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")); COMMENT ON COLUMN "posts"."title" IS 'Title of the post'; COMMENT ON COLUMN "posts"."content" IS 'Main content of the post'; COMMENT ON COLUMN "posts"."createdAt" IS 'Timestamp of post creation'; COMMENT ON COLUMN "posts"."updatedAt" IS 'Timestamp of last update'; COMMENT ON COLUMN "posts"."userId" IS 'ID of the user who created the post'; COMMENT ON COLUMN "posts"."isEdited" IS 'Indicates if the post has been edited'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ae05faaa55c866130abef6e1fe" ON "posts" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ae05faaa55c866130abef6e1fe"`,
    );
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "comments"`);
  }
}
