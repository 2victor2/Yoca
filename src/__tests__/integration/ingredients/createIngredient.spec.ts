import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe("POST - /ingredients", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockIngredient = {
    name: "Cenoura",
    measure: "kg",
    amount: 50,
    amount_max: 100,
    amount_min: 15,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create an ingredient", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("uuid");

    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send(mockIngredient);

    expect(createIngredientResponse.status).toBe(201);
    expect(createIngredientResponse.body).toEqual(
      expect.objectContaining({
        message: "Ingredient created",
        ingredient: {
          id: "uuid",
          ...mockIngredient,
        },
      })
    );
  });
  it("Should not be able to create an ingredient without access_level", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "4002-8922",
        password: "123456",
        access_level: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`).send(mockIngredient)

    expect(createIngredientResponse.status).toBe(401);
    expect(createIngredientResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to create an ingredient with repeated name", async () => {
    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .send(mockIngredient);

    expect(createIngredientResponse.status).toBe(409);
    expect(createIngredientResponse.body).toEqual(
      expect.objectContaining({
        message: "Ingredient already exists, add to its amount instead",
      })
    );
  });
});
