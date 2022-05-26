import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";
import { TESTS_PASSWORD } from "../../../../utils";

describe("UPDATE - /feedbacks/products/:id", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post("/super").send({
      name: "testaurant",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: TESTS_PASSWORD,
    });
  });

  const mockIngredient = {
    name: "Cenoura",
    measure: "kg",
    amount: 50,
    amountMax: 100,
    amountMin: 15,
  };
  const mockProductFeedbackUpdates = {
    description:
      "Massa muito grossa, não consegui bater meu recorde de 45 fatias. Mas a pizza de cenoura estava bem gostosa, comi 7 hehehe.",
    rating: 2.5,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update one product feedback", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const categoriesResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "massas",
      });

    const ingredientsResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    const productResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Pizza",
        price: 4.99,
        calories: 300,
        ingredients: [
          {
            id: ingredientsResponse.body.ingredient.id,
            amount: "45",
          },
        ],
        categories: [categoriesResponse.body.category.id],
      });

    const productFeedbackResponse = await request(app)
      .post("/feedbacks/products")
      .send({
        description: "A pizza estava perfeita!",
        rating: 5,
        productId: productResponse.body.product.id,
      });

    const updateProdFeedback = await request(app)
      .patch(`/feedbacks/products/${productFeedbackResponse.body.feedback.id}`)
      .send(mockProductFeedbackUpdates);

    expect(updateProdFeedback.status).toBe(200);
    expect(updateProdFeedback.body).toMatchObject({
      message: "Product feedback updated",
      feedback: {
        ...updateProdFeedback,
        ...mockProductFeedbackUpdates,
      },
    });
  });
  it("Should not be able to update one product feedback sending unexistent id", async () => {
    const updateProdFeedback = await request(app).patch(
      "/feedbacks/products/5cee5a5f-169d-423b-8c48-64d27d2c59ed"
    );

    expect(updateProdFeedback.status).toBe(404);
    expect(updateProdFeedback.body).toEqual(
      expect.objectContaining({
        message: "Product feedback not found",
      })
    );
  });
});
