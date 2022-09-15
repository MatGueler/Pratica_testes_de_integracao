import supertest from "supertest";
import { prisma } from "../src/database";
import app from "../src/app";
import factoryFunctions from "./factories/itemFactory";

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const body = await factoryFunctions.createItem();
    const result = await supertest(app).post(`/items`).send(body);
    expect(result.status).toBe(201);
  });

  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const body = await factoryFunctions.createItem();
    await supertest(app).post(`/items`).send(body);
    const result = await supertest(app).post(`/items`).send(body);
    expect(result.status).toBe(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const result = await supertest(app).get(`/items`);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe("Testa GET /items/:id ", () => {
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const body = await factoryFunctions.createItem();
    await supertest(app).post(`/items`).send(body);
    const id = await factoryFunctions.getId(body);
    const result = await supertest(app).get(`/items/${id}`);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const result = await supertest(app).get(`/items/${0}`);
    expect(result.status).toBe(404);
  });
});

afterAll(async () => {
  prisma.$disconnect;
});
