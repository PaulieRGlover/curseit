import { FoodsPrismaClient } from '../index.js';

const client = FoodsPrismaClient;
async function main() {
  await client.nutrient.create({
    data: {
      name: 'Magnesium',
    },
  });
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
