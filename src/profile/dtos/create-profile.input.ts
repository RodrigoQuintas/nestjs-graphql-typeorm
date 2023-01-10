import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProfileInput {
  @IsString()
  @IsNotEmpty({ message: 'Name is a required field' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Resume is a required field' })
  resume: string;
}
