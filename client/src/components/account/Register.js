import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addPizzaToOrder,
  createOrder,
  createPizza,
  fetchOrder,
  updatePizza,
} from "../../api";
import { fetchMe, registerUser } from "../../api/users";

import "./account.css";

export default function Register(props) {
  const {
    setToken,
    registerUser,
    currentUser,
    order,
    setOrderId,
    setOrder,
    setCurrentUser,
    orderId,
  } = props;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState();
  const [birthday, setBirthday] = useState(Date);
  const [error, setError] = useState("");

  let navigate = useNavigate();

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h2>Create Your Account</h2>
          </div>
          <form
            className="login-form"
            onSubmit={async (e) => {
              try {
                e.preventDefault();
                let name = `${lastName}, ${firstName}`;
                if (password !== password2) {
                  setError("Passwords don't match!");
                } else {
                  let guest = false;
                  
                  const result = await registerUser(
                    email,
                    name,
                    password,
                    guest
                  );
                  if (result.error) {
                    setError(result.message);
                  } else {
                    let guestPizzas = [];
                    if (order) {
                      guestPizzas = order.pizzas;
                    }

                    localStorage.setItem("token", result.token);
                    setError("");
                    setToken(result.token);
                    setPassword("");
                    setEmail("");
                    setPassword2("");
                    navigate("/");

                    const _order = await createOrder(
                      result.token,
                      result.user.id
                    );

                    setOrderId("NEW ORDER ID:", _order.id);
                    let getOrder = await fetchOrder(result.token, _order.id);

                    if (guestPizzas) {
                      for (let pizza of guestPizzas) {
                        // GRAB GUEST PIZZAS, CREATE NEW PIZZAS, ADD NEW PIZZAS TO THAT ORDER, DELETE GUEST ORDER
                        let token = result.token;
                        let name = pizza.name;
                        let crustId = pizza.crustId;
                        let userId = result.user.id;
                        let featured = false;
                        let size = pizza.sizeId;

                        const _pizza = await createPizza(
                          token,
                          name,
                          crustId,
                          userId,
                          size,
                          featured
                        );

                        await addPizzaToOrder(
                          result.token,
                          getOrder.id,
                          _pizza.id,
                          pizza.amount,
                          navigate
                        );
                      }
                    }
                    getOrder = await fetchOrder(result.token, _order.id);

                    setOrder(getOrder);
                  }
                }
              } catch (error) {
                throw error;
              }
            }}
          >
            <div className="form-input">
              <label>First Name * </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
            </div>
            <div className="form-input">
              <label>Last Name * </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
            </div>
            <div className="form-input">
              <label>E-mail Address * </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="form-input">
              <label>Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="form-input">
              <label>Reenter Password *</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              ></input>
            </div>
            <small>{error}</small>
            <button>SIGN UP</button>
            Already have an account? <Link to="/login">Log in</Link>
          </form>
        </div>
      </div>
    </>
  );
}
