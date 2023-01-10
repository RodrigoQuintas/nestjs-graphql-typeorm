import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @IsString()
  @IsNotEmpty({ message: 'Name is a required field' })
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty({ message: 'Resume is a required field' })
  @IsOptional()
  resume?: string;
}
