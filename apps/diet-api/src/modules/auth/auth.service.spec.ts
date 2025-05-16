import { JwtConfig, JwtConfigSchema } from '@/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { generateMock } from '@anatine/zod-mock';
import { UUIDV4 } from '@/constants';
import { SignUpSchema } from './dto/auth.dto';
import { faker } from '@faker-js/faker';

describe('AuthService', () => {
  let service: AuthService;
  let MOCK_JWT_CONFIG: jest.Mocked<typeof JwtConfig>;
  let MOCK_UUIDV4: jest.Mocked<typeof import('uuid').v4>;
  let MOCK_HASH_SERVICE: jest.Mocked<HashService>;
  let MOCK_PRISMA_SERVICE: jest.MockedObjectDeep<PrismaService>;
  let MOCK_JWT_SERVICE: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtConfig.KEY,
          useValue: generateMock(JwtConfigSchema),
        },
        {
          provide: UUIDV4,
          useValue: jest.fn(),
        },
        {
          provide: HashService,
          useValue: {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
            invalidatedToken: {
              createMany: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signInAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    MOCK_JWT_CONFIG = module.get(JwtConfig.KEY);
    MOCK_UUIDV4 = module.get(UUIDV4);
    MOCK_HASH_SERVICE = module.get(HashService);
    MOCK_PRISMA_SERVICE = module.get(PrismaService);
    MOCK_JWT_SERVICE = module.get(JwtService);
  });

  describe('signUp', () => {
    it('should create a user replacing their password with hash', async () => {
      const MOCK_DTO = generateMock(SignUpSchema);
      const MOCK_HASH = faker.string.alpha(12);
      const MOCK_PRISMA_USER = {
        id: faker.string.alpha(16),
        login: MOCK_DTO.login,
        passwordHash: MOCK_HASH,
      };

      MOCK_HASH_SERVICE.hashPassword.mockResolvedValue(MOCK_HASH);
      MOCK_PRISMA_SERVICE.user.create.mockResolvedValue(MOCK_PRISMA_USER);

      const result = await service.signUp(MOCK_DTO);

      expect(MOCK_HASH_SERVICE.hashPassword).toHaveBeenCalledWith(MOCK_DTO.password);
      expect(MOCK_PRISMA_SERVICE.user.create).toHaveBeenCalledWith({
        data: {
          login: MOCK_DTO.login,
          passwordHash: MOCK_HASH,
        },
      });
    });
  });
});
