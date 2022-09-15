import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";
import { TItemData } from "../../src/types/ItemsTypes";

async function createItem() {
  return {
    title: String(faker.lorem.words(2)),
    url: String(faker.internet.url()),
    description: String(faker.lorem.paragraph(1)),
    amount: Number(faker.finance.amount(5, 8, 0)),
  };
}

async function getId(body: TItemData) {
  const item = await prisma.items.findFirst({ where: { title: body.title } });
  return item.id;
}

const factoryFunctions = {
  createItem,
  getId,
};

export default factoryFunctions;
