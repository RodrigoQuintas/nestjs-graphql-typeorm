import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../common/entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileInput } from './dtos/create-profile.input';
import { UpdateProfileInput } from './dtos/update-profile.input';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findAllProfiles(): Promise<Profile[]> {
    const profiles = this.profileRepository.find();
    return profiles;
  }

  async findProfileById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    return profile;
  }

  async createProfile(data: CreateProfileInput): Promise<Profile> {
    const profile = this.profileRepository.create({ ...data });
    const profileSaved = await this.profileRepository.save(profile);
    if (!profileSaved) {
      throw new InternalServerErrorException('Error to create a user');
    }
    return profileSaved;
  }

  async updateProfile(id: string, data: UpdateProfileInput): Promise<Profile> {
    const profile = await this.findProfileById(id);
    await this.profileRepository.update(profile, {
      ...data,
    });

    const updatedProfile = this.profileRepository.create({
      ...profile,
      ...data,
    });

    return updatedProfile;
  }

  async deleteProfile(id: string): Promise<boolean> {
    const profile = await this.findProfileById(id);
    const deletedProfile = await this.profileRepository.delete(profile);
    if (deletedProfile) return true;

    return false;
  }
}
