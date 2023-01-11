import { Profile } from '../entities/profile.entity';

export default class TestUtil {
  static getValidProfile(): Profile {
    const profile = new Profile();
    profile.id = '1';
    profile.name = 'Test';
    profile.resume = 'Resume Test';
    return profile;
  }
}
