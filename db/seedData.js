const client = require("./client");
const { createCrust } = require("./crusts");
const { createSize } = require("./sizes");
const { createTopping } = require("./toppings");
const { createUser } = require("./users");

const dropTables = async () => {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS pizza_order;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS pizza_toppings;
    DROP TABLE IF EXISTS pizza;
    DROP TABLE IF EXISTS sizes;
    DROP TABLE IF EXISTS crusts;
    DROP TABLE IF EXISTS toppings;
    DROP TABLE IF EXISTS locations;
    DROP TABLE IF EXISTS users;
    `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.log("Error dropping tables!");
    throw error;
  }
};

const createTables = async () => {
  try {
    console.log("Starting to create tables...");

    console.log("Creating users table...");
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT true,
      admin BOOLEAN DEFAULT false,
      birthday DATE
    );`);

    console.log("Creating locations table...");
    await client.query(`
    CREATE TABLE locations(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id) NOT NULL,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      apartment BOOLEAN DEFAULT false,
      main BOOLEAN DEFAULT false
    );`);

    console.log("Creating toppings table...");
    await client.query(`
    CREATE TABLE toppings(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      amount INTEGER NOT NULL,
      price FLOAT NOT NULL,
      quantity INTEGER,
      category VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT true
    );`);

    console.log("Creating crusts table...");
    await client.query(`
    CREATE TABLE crusts(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      price FLOAT NOT NULL,
      quantity INTEGER,
      active BOOLEAN DEFAULT true
    );`);

    console.log("Creating sizes table...");
    await client.query(`
      CREATE TABLE sizes(
        id SERIAL PRIMARY KEY,
        size VARCHAR(255)
      );
    `);

    console.log("Creating pizza table...");
    await client.query(`
      CREATE TABLE pizza(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        "crustId" INTEGER REFERENCES crusts(id) NOT NULL,
        "userId" INTEGER REFERENCES users(id) NOT NULL,
        featured BOOLEAN DEFAULT false
      );
    `);

    console.log("Creating pizza_toppings table...");
    await client.query(`
      CREATE TABLE pizza_toppings(
        id SERIAL PRIMARY KEY,
        "pizzaId" INTEGER REFERENCES pizza(id) NOT NULL,
        "toppingId" INTEGER REFERENCES toppings(id) NOT NULL,
        amount VARCHAR(255) NOT NULL,
        double BOOLEAN DEFAULT false
      );
    `);

    console.log("Creating orders table...");
    await client.query(`
      CREATE TABLE orders(
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) NOT NULL,
        active BOOLEAN DEFAULT true,
        price FLOAT,
        delivery BOOLEAN DEFAULT false
      );
    `);

    console.log("Creating pizza_order table...");
    await client.query(`
      CREATE TABLE pizza_order(
        id SERIAL PRIMARY KEY,
        "pizzaId" INTEGER REFERENCES pizza(id) NOT NULL,
        "orderId" INTEGER REFERENCES orders(id) NOT NULL,
        amount INTEGER NOT NULL
      );
    `);

    console.log("Creating reviews table...");
    await client.query(`
      CREATE TABLE reviews(
        id SERIAL PRIMARY KEY,
        "pizzaId" INTEGER REFERENCES pizza(id) NOT NULL,
        "userId" INTEGER REFERENCES users(id) NOT NULL,
        content VARCHAR(255),
        stars INTEGER NOT NULL
      );
    `);

    console.log("Finished creating tables!");
  } catch (error) {
    console.log("Error creating tables...");
    throw error;
  }
};

const createInitialUsers = async () => {
  try {
    await createUser({
      name: "james01",
      password: "james01",
      email: "generalzhenwu@gmail.com",
    });
    await createUser({
      name: "joseph01",
      password: "joseph01",
      email: "belicjel@gmail.com",
    });
    await createUser({
      name: "brian01",
      password: "brian01",
      email: "jimmys14205@gmail.com",
    });

    await createUser({
      name: "mike01",
      password: "mike01",
      email: "belicmichael@gmail.com",
    });
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
};

const createInitialToppings = async () => {
  try {
    console.log("Starting to create toppings...");

    console.log("Finished creating toppings!");
  } catch (error) {
    console.log("Error creating toppings!");
    throw error;
  }
};

const createInitialCrusts = async () => {
  try {
    createCrust({
      name: "Original Crust",
      price: "11.99",
      quantity: "1000",
    });
    createCrust({
      name: "Pepperoni-Stuffed Crust",
      price: "13.99",
      quantity: "500",
    });
    createCrust({
      name: "Thin Crust",
      price: "11.99",
      quantity: "700",
    });
    createCrust({
      name: "Gluten-Free Crust",
      price: "12.99",
      quantity: "200",
    });
  } catch (error) {
    console.log("Error creating crusts!");
    throw error;
  }
};

const createInitialSizes = async () => {
  try {
    await createSize({ size: "small" });
    await createSize({ size: "medium" });
    await createSize({ size: "large" });
    await createSize({ size: "extra large" });
  } catch (error) {
    console.log("Error creating sizes!");
  }
};

async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialToppings();
    await createInitialCrusts();
    await createInitialSizes();
    // await createInitialRoutineActivities();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}
module.exports = {
  rebuildDB,
  dropTables,
  createTables,
};
