import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from 'src/common/entities/profile.entity';
import { CreateProfileInput } from './dtos/create-profile.input';
import { UpdateProfileInput } from './dtos/update-profile.input';
import { ProfileService } from './profile.service';

@Resolver()
export class ProfileResolver {
  constructor(private profileService: ProfileService) {}

  @Query(() => [Profile])
  async profiles(): Promise<Profile[]> {
    const profiles = await this.profileService.findAllProfiles();
    return profiles;
  }

  @Query(() => Profile)
  async profile(@Args('id') id: string): Promise<Profile> {
    const profiles = await this.profileService.findProfileById(id);
    return profiles;
  }

  @Mutation(() => Profile)
  async createProfile(
    @Args('data') data: CreateProfileInput,
  ): Promise<Profile> {
    const profile = await this.profileService.createProfile(data);
    return profile;
  }

  @Mutation(() => Profile)
  async updateProfile(
    @Args('id') id: string,
    @Args('data') data: UpdateProfileInput,
  ): Promise<Profile> {
    const profile = await this.profileService.updateProfile(id, data);
    return profile;
  }

  @Mutation(() => Boolean)
  async deleteProfile(@Args('id') id: string): Promise<boolean> {
    const hasBeenDeleted = await this.profileService.deleteProfile(id);
    return hasBeenDeleted;
  }
}
