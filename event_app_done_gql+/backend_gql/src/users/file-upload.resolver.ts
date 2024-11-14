// src/types/upload.types.ts
export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

// src/scalar/upload.scalar.ts
import { Scalar } from '@nestjs/graphql';
import { GraphQLScalarType, Kind } from 'graphql';

@Scalar('Upload')
export class UploadScalar extends GraphQLScalarType {
  constructor() {
    super({
      name: 'Upload',
      description: 'The `Upload` scalar type represents a file upload.',
      parseValue: (value) => value,
      parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
          return ast.value;
        }
        return null;
      },
      serialize: (value) => value,
    });
  }
}

// src/users/file-upload.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Resolver()
export class FileUploadResolver {
  @Mutation(() => Boolean)
  async uploadFile(
    @Args({ name: 'file', type: () => 'Upload' })
    file: Upload
  ): Promise<boolean> {
    const { createReadStream, filename } = file;

    return new Promise(async (resolve, reject) => {
      const uploadDir = join(__dirname, '..', '..', 'uploads');

      createReadStream()
        .pipe(createWriteStream(join(uploadDir, filename)))
        .on('finish', () => resolve(true))
        .on('error', (error) => {
          console.error('Upload failed:', error);
          reject(false);
        });
    });
  }
}
