import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/home/home";
import Header from "./components/header/Header";
import Login from "./components/account/Login";
import Size from "./components/size/size";
import { fetchActiveUserOrder, fetchMe, registerUser } from "./api/users";
import Register from "./components/account/Register";
import {
  createOrder,
  fetchCrusts,
  fetchOrder,
  fetchSizes,
  fetchToppings,
} from "./api";
import Cart from "./components/cart/cart";
import Toppings from "./components/toppings/toppings";
import { fetchLocations } from "./api/location";
import Admin from "./components/admin/Admin";
import EditPizza from "./components/edit-pizza/edit-pizza";
import Location from "./components/checkout/location";
import Checkout from "./components/checkout/checkout";
import Success from "./components/checkout/success";

function App() {
  const [orderId, setOrderId] = useState();
  const [order, setOrder] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [token, setToken] = useState("");
  const [sizes, setSizes] = useState([]);
  const [crusts, setCrusts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");

    function randomString(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    async function createGuest() {
      let randomEmail = randomString(20);
      randomEmail += "@saucebossguest.com";
      let randomPassword = randomString(20);

      let guestUser = {
        email: randomEmail,
        password: randomPassword,
        name: "Guest",
        guest: true,
      };

      const result = await registerUser(
        guestUser.email,
        guestUser.name,
        guestUser.password,
        guestUser.guest
      );

      setCurrentUser(result);
      setToken(result.token);
      localStorage.setItem("token", result.token);
      console.log("guest created:", result);
    }

    if (!localStorageToken) {
      createGuest();
    }
    if (order) {
      console.log("order:", order);
    }
  }, [order]);

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");

    function randomString(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    async function createGuest() {
      let randomEmail = randomString(20);
      randomEmail += "@saucebossguest.com";
      let randomPassword = randomString(20);

      let guestUser = {
        email: randomEmail,
        password: randomPassword,
        name: "Guest",
        guest: true,
      };

      const result = await registerUser(
        guestUser.email,
        guestUser.password,
        guestUser.name,
        guestUser.guest
      );

      setCurrentUser(result);
      setToken(result.token);
      localStorage.setItem("token", result.token);
      console.log("guest created:", result);
    }

    if (!localStorageToken) {
      createGuest();
    }
  }, [token]);

  useEffect(() => {
    const getStuff = async () => {
      await fetchCrusts(setCrusts);
      await fetchSizes(setSizes);
      await fetchToppings(setToppings);
    };

    getStuff();

    const localStorageToken = localStorage.getItem("token");

    async function getMe() {
      setToken(localStorageToken);
      const result = await fetchMe(localStorageToken);
      if (result && result.active === true) {
        setCurrentUser(result);
      } else {
        return;
      }

      if (result) {
        const { id } = await fetchActiveUserOrder(localStorageToken, result.id);
        if (id) {
          setOrderId(id);
          const order = await fetchOrder(localStorageToken, id);
          console.log(order);
          if (order) {
            setOrder(order);
          }
        }
      }
    }
    if (localStorageToken) {
      getMe();
    }
  }, [token]);

  const getNum = () => {
    let total = 0;
    for (let pizza of order.pizzas) {
      total += pizza.amount;
    }
    return total;
  };

  const getLocations = async () => {
    await fetchLocations(setLocations);
  };
  useEffect(() => {
    getLocations();
  }, []);
  return (
    <>
      <Header
        currentUser={currentUser}
        numItems={order.pizzas ? getNum() : 0}
        setToken={setToken}
        setCurrentUser={setCurrentUser}
        setOrder={setOrder}
        setOrderId={setOrderId}
      />

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={
            <Login
              order={order}
              orderId={orderId}
              setOrder={setOrder}
              setCurrentUser={setCurrentUser}
              setOrderId={setOrderId}
              setToken={setToken}
              currentUser={currentUser}
              registerUser={registerUser}
            />
          }
        ></Route>
        <Route
          path="/register"
          element={
            <Register
              order={order}
              orderId={orderId}
              setOrder={setOrder}
              setCurrentUser={setCurrentUser}
              setOrderId={setOrderId}
              setToken={setToken}
              currentUser={currentUser}
              registerUser={registerUser}
            />
          }
        ></Route>
        <Route
          path="/:pizzaId/size"
          element={
            <Size
              token={token}
              orderId={orderId}
              setOrderId={setOrderId}
              setOrder={setOrder}
              user={currentUser}
              sizes={sizes}
              crusts={crusts}
            />
          }
        ></Route>
        <Route
          path="/:pizzaId/toppings"
          element={
            <Toppings token={token} orderId={orderId} setOrder={setOrder} />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              order={order}
              sizes={sizes}
              crusts={crusts}
              token={token}
              setOrder={setOrder}
              orderId={orderId}
            />
          }
        ></Route>
        <Route
          path="cart/:pizzaId/edit"
          element={
            <EditPizza
              token={token}
              orderId={orderId}
              setOrder={setOrder}
              user={currentUser}
              sizes={sizes}
              crusts={crusts}
            />
          }
        ></Route>
        <Route
          path="/location"
          element={<Location token={token} user={currentUser} />}
        ></Route>
        <Route
          path="/checkout"
          element={
            <Checkout
              user={currentUser}
              order={order}
              setOrder={setOrder}
              setOrderId={setOrderId}
              token={token}
            />
          }
        ></Route>
        <Route path="/:orderId/success" element={<Success />} />
        {currentUser.admin ? (
          <Route
            path="/admin/*"
            element={
              <Admin
                token={token}
                sizes={sizes}
                crusts={crusts}
                user={currentUser}
                toppings={toppings}
                setToppings={setToppings}
              />
            }
          />
        ) : (
          <></>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
