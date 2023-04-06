import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ClientProxy } from '@nestjs/microservices';

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
});
