const client = require("./client");

async function getAllToppings() {
  const { rows } = await client.query(
    `SELECT *
    FROM toppings;`
  );

<<<<<<< HEAD
  if (!rows) {
    return null;
  }
  return rows;
}

const getToppingById = async (id) => {
  try {
    const {
      rows: [topping],
    } = await client.query(`SELECT * FROM toppings WHERE id=($1)`, [id]);
    return topping;
  } catch (error) {
    throw error;
  }
};

async function getToppingByName(name) {
  const {
    rows: [topping],
  } = await client.query(
    `
  SELECT * FROM activities
  WHERE name=$1
    `,
    [name]
  );
  return topping;
}

async function attachToppingsToPizzas(pizzas) {
  const { id } = pizzas;
  const { rows: toppings } = await client.query(
    `
    SELECT *
    FROM toppings
    JOIN pizza_toppings ON pizza_toppings."toppingId"=toppings.id
    WHERE pizza_toppings."pizzaId"=$1
  `,
    [id]
  );

  return toppings;
}

const createTopping = async ({ name, price, quantity, category }) => {
  const {
    rows: [topping],
  } = await client.query(
    `
                  INSERT INTO toppings(name, price, quantity, category)
                  VALUES ($1, $2, $3, $4)
                  RETURNING *;
              `,
    [name, price, quantity, category]
  );
  return topping;
};

=======
>>>>>>> 3fd0f9345fc40d9f9554e81af3a45360c55640f1
const updateToppings = async ({ id, ...fields }) => {
  const setStr = Object.keys(fields)
    .map((key, idx) => `"${key}"=$${idx + 1}`)
    .join(", ");

  if (setStr.length === 0) {
    return;
  }

  try {
    const {
      rows: [topping],
    } = await client.query(
      `UPDATE toppings SET ${setStr} WHERE id=$${id} RETURNING *;`,
      Object.values(fields)
    );
    return topping;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTopping,
  updateToppings,
  getToppingById,
  attachToppingsToPizzas,
  getToppingByName,
  getAllToppings,
};
