import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileInput } from './dtos/create-profile.input';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async listProfiles(): Promise<Profile[]> {
    const profiles = this.profileRepository.find();
    return profiles;
  }

  async createProfile(data: CreateProfileInput): Promise<Profile> {
    const profile = this.profileRepository.create({ ...data });
    const profileSaved = await this.profileRepository.save(profile);
    if (!profileSaved) {
      throw new InternalServerErrorException('Error to create a user');
    }
    return profileSaved;
  }
}
