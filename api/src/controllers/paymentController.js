const mercadopago = require("mercadopago");
const { Game } = require("../db");
require("dotenv").config();

// Test user token, not a real one
const { MERCADO_PAGO_TOKEN, CURRENCY, PORT } = process.env;

// Maybe this could be in the .env
const HOST = `http://localhost:${PORT}`;

// This code is ugly, I will clean it up
const createOrder = async (req, res) => {
  try {
    // items = [{ monopoly, ... }, { nicoJuego, ... }]
    const { items } = req.body;

    // Game must exist in the database

    mercadopago.configure({
      access_token: MERCADO_PAGO_TOKEN,
    });

    let pedido = [];
    const preferences = items.map((item) => {
      pedido.push({
        title: item.title,
        unit_price: item.unit_price,
        currency_id: CURRENCY,
        quantity: item.quantity,
      });
    });

    const result = await mercadopago.preferences.create({
      items: pedido,
      back_urls: {
        success: `${HOST}/success`,
        failure: `${HOST}/failure`,
        pending: `${HOST}/pending`,
      },
    });

    return res.status(200).json({
      id_mercadopago: result.body.id,
      init_point: result.body.init_point,
    });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
};

module.exports = {
  createOrder,
};