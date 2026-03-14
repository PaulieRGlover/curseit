// eslint-disable-next-line
import { PrismaClient as FoodsPrismaClient } from '../../../foods-orm/dist/index.js';

import { Prisma, PrismaClient } from '../../dist/index.js';

import { EnvSchema } from './env.dto.js';
import { getFoods } from './foods.js';
import { PRIME_USER_LOGIN, UserWithPassword, getUsers } from './users.js';

const client = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const foodsClient = new FoodsPrismaClient({
  datasources: { db: { url: process.env.FOODS_DATABASE_URL } },
});

async function main() {
  const envDto = EnvSchema.safeParse(process.env);
  if (!envDto.success) {
    throw envDto.error;
  }

  await client.user.deleteMany({ where: {} });

  const users = await getUsers(envDto.data.hashSecret);
  const getExcerpt = (user: UserWithPassword) => `\n\t${user.login}\n\t${user.password}`;
  const usersExcerpt = [users[0], users[1], users[2]].reduce(
    (excerpt, user) => (excerpt += getExcerpt(user)),
    '',
  );
  users.forEach(user => delete user.password);
  const usersCreated = await client.user.createManyAndReturn({
    data: users,
  });

  console.log(`✅ Successfully seeded ${usersCreated.length} users:${usersExcerpt}`);

  await client.nutrient.deleteMany({ where: {} });

  const nutrients = await foodsClient.nutrient.findMany({
    where: {},
    include: {
      _count: {
        select: { foods: true },
      },
    },
  });

  const nutrientsCreated = await client.nutrient.createManyAndReturn({
    data: nutrients.map(({ id, _count, ...nutrient }) => {
      return {
        ...nutrient,
        externalId: id,
        externalWeight: _count.foods,
      };
    }),
  });

  console.log(`✅ Successfully seeded ${nutrientsCreated.length} nutrients`);

  await client.food.deleteMany({ where: {} });

  const primeUser = usersCreated.find(({ login }) => login === PRIME_USER_LOGIN);
  if (!primeUser) {
    throw new Error('no prime user');
  }

  const foods = getFoods({
    proteinId: nutrientsCreated.find(({ name }) => name === 'Protein')?.id ?? '',
    fatsId: nutrientsCreated.find(({ name }) => name === 'Total lipid (fat)')?.id ?? '',
    carbsId: nutrientsCreated.find(({ name }) => name === 'Carbohydrate, by difference')?.id ?? '',
    nitrogenId: nutrientsCreated.find(({ name }) => name === 'Nitrogen')?.id ?? '',
    calciumId: nutrientsCreated.find(({ name }) => name === 'Calcium, Ca')?.id ?? '',
    ironId: nutrientsCreated.find(({ name }) => name === 'Iron, Fe')?.id ?? '',
    magnesiumId: nutrientsCreated.find(({ name }) => name === 'Magnesium, Mg')?.id ?? '',
    potassiumId: nutrientsCreated.find(({ name }) => name === 'Potassium, K')?.id ?? '',
  });

  const foodsCreated = await client.$transaction(
    foods.map(food => {
      return client.food.create({
        data: {
          userId: primeUser.id,
          name: food.name,
          description: food.description,
          variations: {
            create: food.variations.map(variation => {
              const variationCreate: Prisma.FoodVariationCreateWithoutFoodInput = {
                name: variation.name,
                counter: variation.counter,
              };

              if (variation.portionSizeInGrams) {
                variationCreate.portionSizeInGrams = variation.portionSizeInGrams;
              }

              if (variation.portionSizeDisplayUnit) {
                variationCreate.portionSizeDisplayUnit = variation.portionSizeDisplayUnit;
              }

              if (variation.nutrients) {
                variationCreate.nutrients = {
                  create: variation.nutrients.map(nutrient => {
                    const nutrientCreate: Prisma.NutrientInFoodVariationCreateWithoutFoodVariationInput = {
                      valueInGrams: nutrient.valueInGrams,
                      valueDisplayUnit: nutrient.valueDisplayUnit,
                      nutrient: {
                        connect: { id: nutrient.nutrientId },
                      },
                    };

                    return nutrientCreate;
                  }),
                };
              }

              if (variation.portions) {
                variationCreate.portions = {
                  create: variation.portions.map(portion => {
                    const portionCreate: Prisma.FoodPortionCreateWithoutFoodVariationInput = {
                      sizeInGrams: portion.sizeInGrams,
                      remainingInGrams: portion.remainingInGrams
                        ? portion.remainingInGrams
                        : portion.sizeInGrams,
                    };

                    if (portion.dateAdded) {
                      portionCreate.dateAdded = portion.dateAdded;
                    }

                    if (portion.dateExpiring) {
                      portionCreate.dateExpiring = portion.dateExpiring;
                    }

                    if (portion.sizeDisplayUnit) {
                      portionCreate.sizeDisplayUnit = portion.sizeDisplayUnit;
                    }

                    if (portion.remainingDisplayUnit) {
                      portionCreate.remainingDisplayUnit = portion.remainingDisplayUnit;
                    }

                    return portionCreate;
                  }),
                };
              }

              return variationCreate;
            }),
          },
        },
      });
    }),
  );

  console.log(`✅ Successfully seeded ${foodsCreated.length} foods`);
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await client.$disconnect();
    process.exit(1);
  });
