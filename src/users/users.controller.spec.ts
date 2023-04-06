import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ClientProxy } from '@nestjs/microservices';
import { hash } from 'bcrypt';

describe('UsersController', () => {
  let usersController: UsersController;
  let clientProxyMock: Partial<ClientProxy>;
  let usersService: UsersService;

  const userList = [
    {
      taskOne: {
        email: 'test@example.com',
        password: '2b$10$.KUBuRNTfeJz64gcB/pkFOR16pVVf7EbyOdfOdFJ4WpeIcJhC.jCW',
        token: '$2b$10$FLlEeVtc4ZJZkIgV8SOHJ.RRRZQ5TKbWJ/HQVGJ7qKHsG362Ylr.u',
      },
      taskThree: {
        id: null,
        imageRouter: null,
        hash: null,
        imageCode64: null,
      },
    },
    
  ]

  beforeEach(async () => {
    clientProxyMock = {
      emit: jest.fn(),
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(userList),
            findOne: jest.fn(),
            remove: jest.fn(),
            updateHash: jest.fn(),
          }
        },
        {
          provide: 'userService',
          useValue: clientProxyMock,
        }
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService)
    
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const result = await usersController.create(userData);

      expect(result).toBeDefined();
      // You can add additional assertions to test the behavior of the route
    });
  });

  describe('GET /users/:id', () => {
    it('should return user details when valid id is provided', async () => {
      const userId = '7'; // the user ID to be used in the test
      const expectedResult = { 
        id: userId,
        email: 'michael.lawson@reqres.in',
        first_name: 'Michael',
        last_name: 'Michael',
        avatar: 'https://reqres.in/img/faces/7-image.jpg'
      }; // the expected result from the API
      
      // make a GET request to the API
      const response = await usersController.findUser(userId);
  
      // assert that the API response matches the expected result
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResult);
    });
  
    it('should return 404 error when invalid id is provided', async () => {
      const userId = 'invalid-id'; // the invalid user ID to be used in the test
      
      // make a GET request to the API with an invalid ID
      const response = await usersController.findUser('2376738');
  
      // assert that the API returns a 404 error
      expect(response.status).toEqual(404);
    });
  });
  
});
