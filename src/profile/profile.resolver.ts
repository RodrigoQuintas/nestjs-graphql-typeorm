import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from 'src/entities/profile.entity';
import { CreateProfileInput } from './dtos/create-profile.input';
import { ProfileService } from './profile.service';

@Resolver()
export class ProfileResolver {
  constructor(private profileService: ProfileService) {}

  @Query(() => [Profile])
  async profiles(): Promise<Profile[]> {
    const profiles = await this.profileService.listProfiles();
    return profiles;
  }

  @Mutation(() => Profile)
  async createProfile(
    @Args('data') data: CreateProfileInput,
  ): Promise<Profile> {
    const profile = await this.profileService.createProfile(data);
    return profile;
  }
}
