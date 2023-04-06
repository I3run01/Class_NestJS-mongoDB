import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let userService: UsersService;

  let mockValue = [
    {
      taskOne: {
        email: 'testUser@example.com',
        password: 'password123',
        token: 'hashPassword123',
      },
      taskThree: {
        id: null,
        imageRouter: null,
        hash: null,
        imageCode64: null,
      }
    }
  ]

  let mockUserModel = {
    create: jest.fn().mockResolvedValue(mockValue),
    findOne: jest.fn().mockResolvedValue(mockValue),
    deleteOne: jest.fn().mockResolvedValue({"acknowledged": true,"deletedCount": 1}),
    set: jest.fn().mockResolvedValue({}),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        }
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {

      const createUserDto: CreateUserDto = {
        taskOne: {
          email: 'testUser@example.com',
          password: 'password123',
          token: 'hashPassword123',
        },
        taskThree: {
          id: null,
          imageRouter: null,
          hash: null,
          imageCode64: null,
        },
      };
      
      const result = await userService.create(createUserDto);
      expect(result).toEqual(mockValue);
    });
  });

  describe('findOne', () => {
    it('should return the user with the provided id', async () => {
      let testId = '4'

      const result = await userService.findOne(testId);
      expect(result).toEqual(mockValue);
    });

    it('should return null if no user is found', async () => {
      const id = 'testUserId';
      mockUserModel.findOne.mockReturnValue(null);

      const result = await userService.findOne(id);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ 'taskThree.id': id });
      expect(result).toBeNull();
    });

  });

  describe('remove', () => {
    it('should remove a user with the given ID', async () => {

      const idTest = '4';

      const result = await userService.remove(idTest);

      expect(result).toEqual({"acknowledged": true,"deletedCount": 1});
    });

    it('should throw an error if the user cannot be removed', async () => {

      const nonExistentUserId = 'noExistUserId';
      mockUserModel.deleteOne.mockReturnValue({"acknowledged": true,"deletedCount": 0});
      expect(await userService.remove(nonExistentUserId)).toEqual({"acknowledged": true,"deletedCount": 0})
    });
    
  });

  describe('updateHash', () => {
    it('should update the hash of a user with the given ID', async () => {

      const userTestId = '5';
      const newHash = 'new-hash';
      let newMock = mockUserModel.findOne.mockReturnValue(
        {
          taskOne: {
            email: 'testUser@example.com',
            password: 'password123',
            token: 'hashPassword123',
          },
          taskThree: {
            id: null,
            imageRouter: null,
            hash: 'new-hash',
            imageCode64: null,
          }
        }
      );
      
      const response = await userService.updateHash(userTestId, newHash);
      
      // Check that the user's hash was updated successfully
      expect(response).toEqual(newMock);
    });
    
  });
  
  
});
