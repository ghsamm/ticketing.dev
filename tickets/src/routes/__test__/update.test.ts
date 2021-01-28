import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWraper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "sdfsdf",
      price: 55,
    })
    .expect(404);
});

it("returns a 401 if the is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "sdfsdf",
      price: 55,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "smdfi",
      price: 55,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin()) // sign in as different user
    .send({
      title: "qsdif",
      price: 77,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "smdfi",
      price: 55,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 77,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "sdfdsf",
      price: -1,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "sdfdsf",
      price: 0,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});

it("udpates the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "smdfi",
      price: 55,
    })
    .expect(201);

  const updateResponse = await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "zz",
      price: 88,
    })
    .expect(200);

  expect(updateResponse.body.title).toEqual("zz");
  expect(updateResponse.body.price).toEqual(88);
});

it("does not allow adding new properties to tickets", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "pocvz",
      price: 8,
    })
    .expect(201);

  const updateResponse = await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "zfz",
      price: 9,
      newProp: "someval",
    })
    .expect(200);

  expect(updateResponse.body.newProp).toBeUndefined();
});

it("published an event", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "smdfi",
      price: 55,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "zz",
      price: 88,
    })
    .expect(200);
  expect(natsWraper.client.publish).toHaveBeenCalledTimes(2);
});
