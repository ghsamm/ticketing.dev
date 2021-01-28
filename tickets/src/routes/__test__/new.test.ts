import { response } from "express";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWraper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for POST requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a different status if the user is signed in ", async () => {
  const resposnse = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "smqlkdfj",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "sdfsf",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  // check that ticket was saved
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "smldfkj",
      price: 10,
    })
    .expect(201);

  const newTickets = await Ticket.find({});
  expect(newTickets.length).toEqual(1);

  expect(newTickets[0].title).toEqual("smldfkj");
});

it("published an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "zmlic",
      price: 10,
    })
    .expect(201);

  expect(natsWraper.client.publish).toHaveBeenCalled();
});
