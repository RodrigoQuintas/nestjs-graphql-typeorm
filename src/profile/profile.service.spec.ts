import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../common/test/test.utils';
import { Profile } from '../common/entities/profile.entity';
import { ProfileService } from './profile.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;
  const mockProfileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  beforeEach(async () => {
    mockProfileRepository.find.mockReset();
    mockProfileRepository.findOne.mockReset();
    mockProfileRepository.create.mockReset();
    mockProfileRepository.save.mockReset();
    mockProfileRepository.update.mockReset();
    mockProfileRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findProfileById', () => {
    it('should be a profile', async () => {
      const profile: Profile = TestUtil.getValidProfile();
      mockProfileRepository.findOne.mockReturnValue(profile);
      const profileFound = await service.findProfileById('1');
      expect(profileFound).toMatchObject({ id: profile.id });
      expect(mockProfileRepository.findOne).toBeCalledTimes(1);
    });

    it('should return an exception when it doesnt find a profile', async () => {
      mockProfileRepository.findOne.mockReturnValue(null);
      await expect(service.findProfileById('3')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockProfileRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('findAllProfiles ', () => {
    it('should be a profile list', async () => {
      const profile: Profile = TestUtil.getValidProfile();
      mockProfileRepository.find.mockReturnValue([profile, profile, profile]);
      const profiles: Profile[] = await service.findAllProfiles();
      expect(profiles).toHaveLength(3);
      expect(mockProfileRepository.find).toBeCalledTimes(1);
    });
  });

  describe('createProfile ', () => {
    it('should create an user', async () => {
      const profile: Profile = TestUtil.getValidProfile();
      mockProfileRepository.create.mockReturnValue(profile);
      mockProfileRepository.save.mockReturnValue(profile);
      const profileCreated: Profile = await service.createProfile(profile);
      expect(profileCreated).toMatchObject(profile);
      expect(mockProfileRepository.create).toBeCalledTimes(1);
      expect(mockProfileRepository.save).toBeCalledTimes(1);
    });

    it('should return an exception when try create a profile', async () => {
      const profile: Profile = TestUtil.getValidProfile();
      mockProfileRepository.create.mockReturnValue(profile);
      mockProfileRepository.save.mockReturnValue(null);
      await expect(service.createProfile(profile)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      expect(mockProfileRepository.create).toBeCalledTimes(1);
      expect(mockProfileRepository.save).toBeCalledTimes(1);
    });
  });

  describe('updateProfile ', () => {
    it('should update a profile', async () => {
      const profile: Profile = TestUtil.getValidProfile();
      const profileUpdate: Partial<Profile> = { name: 'Mock Atualizado' };
      mockProfileRepository.findOne.mockReturnValue(profile);
      mockProfileRepository.update.mockReturnValue({
        ...profile,
        ...profileUpdate,
      });
      mockProfileRepository.create.mockReturnValue({
        ...profile,
        ...profileUpdate,
      });
      const profileUpdated: Profile = await service.updateProfile('1', profile);
      expect(profileUpdated).toMatchObject({ name: profileUpdate.name });
      expect(mockProfileRepository.findOne).toBeCalledTimes(1);
      expect(mockProfileRepository.update).toBeCalledTimes(1);
      expect(mockProfileRepository.create).toBeCalledTimes(1);
    });

    it('should return an exception when try find a profile to update it', async () => {
      const profile: Profile = TestUtil.getValidProfile();
      const profileUpdate: Partial<Profile> = { name: 'Mock Atualizado' };
      mockProfileRepository.findOne.mockReturnValue(null);
      mockProfileRepository.update.mockReturnValue({
        ...profile,
        ...profileUpdate,
      });
      mockProfileRepository.create.mockReturnValue({
        ...profile,
        ...profileUpdate,
      });
      await expect(service.updateProfile('3', profile)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockProfileRepository.findOne).toBeCalledTimes(1);
      expect(mockProfileRepository.update).toBeCalledTimes(0);
      expect(mockProfileRepository.create).toBeCalledTimes(0);
    });
  });

  describe('deleteProfile ', () => {
    it('should delete a profile', async () => {
      const profile: Profile = TestUtil.getValidProfile();
      mockProfileRepository.findOne.mockReturnValue(profile);
      mockProfileRepository.delete.mockReturnValue(profile);
      const profileHasBeenDeleted: boolean = await service.deleteProfile('1');
      expect(profileHasBeenDeleted).toEqual(true);
      expect(mockProfileRepository.findOne).toBeCalledTimes(1);
      expect(mockProfileRepository.delete).toBeCalledTimes(1);
    });

    it('should return an exception when try find a profile to delete it', async () => {
      mockProfileRepository.findOne.mockReturnValue(null);
      mockProfileRepository.delete.mockReturnValue(null);
      await expect(service.deleteProfile('3')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockProfileRepository.findOne).toBeCalledTimes(1);
      expect(mockProfileRepository.delete).toBeCalledTimes(0);
    });

    it('should return a false when profile was not deleted', async () => {
      const profile: Profile = TestUtil.getValidProfile();
      mockProfileRepository.findOne.mockReturnValue(profile);
      mockProfileRepository.delete.mockReturnValue(null);
      const profileHasBeenDeleted: boolean = await service.deleteProfile('1');
      expect(profileHasBeenDeleted).toEqual(false);
      expect(mockProfileRepository.findOne).toBeCalledTimes(1);
      expect(mockProfileRepository.delete).toBeCalledTimes(1);
    });
  });
});
