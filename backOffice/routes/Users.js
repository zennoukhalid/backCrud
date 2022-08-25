const express = require("express");
const users = express.Router();
const router = require("express").Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../Models/User");
users.use(cors());

process.env.SECRET_KEY = "secret";

users.get("/", (req, res) => {
  User.findAndCountAll()
    .then((result) =>
      res.json({ data: result["rows"], count: result["count"] })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

users.get("/:id", (req, res) => {
  User.findOne({ where: { id: req.params.id } })
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json("Error: " + err));
});

users.delete("/dellete/:id", (req, res) => {
  User.destroy({
    where: { id: req.params.id },
  })
    .then((result) => res.json({ result }))
    .catch((err) => res.status(400).json("Error: " + err));
});

users.put("/:id", (req, res) => {
  const today = new Date();
  const userDataUp = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    created: today,
  };
  User.update(userDataUp, { where: { id: req.params.id } })
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json("Error: " + err));
});

users.post("/Add", (req, res) => {
  const today = new Date();
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    created: today,
  };

  User.findOne({
    where: {
      first_name: req.body.first_name,
    },
  })
    .then((user) => {
      if (!user) {
        User.create(userData)
          .then((user) => {
            res.json({ status: user.first_name + " add with sucsess!" });
          })
          .catch((err) => {
            res.send("error: " + err);
          });
      } else {
        res.json({ error: "user already exists" });
      }
    })
    .catch((err) => {
      res.send("error: " + err);
    });
});

module.exports = users;
