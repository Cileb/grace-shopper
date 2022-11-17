import { destroyPizza } from "../../api";
import "./cart.css";

const Cart = (props) => {
  console.log(props.order.pizzas);
  console.log(props.sizes);

  const handleDestroy = async (pizzId) => {
    await destroyPizza(props.token, pizzId);
  };

  return (
    <div className="cart">
      {props.order.pizzas &&
        props.order.pizzas.map((pizza) => (
          <div key={pizza.id}>
            <header className="cart-pizza-head">
              <h3>
                {props.sizes[pizza.sizeId - 1].size} {pizza.name} x{" "}
                {pizza.amount}
              </h3>
              <span>
                <a>Edit</a>
                <a onClick={() => handleDestroy(pizza.id)}>Destroy</a>
              </span>
            </header>
            <div className="cart-pizza-ingredients">
              <p>{props.crusts[pizza.crustId - 1].name}</p>
              <p>{pizza.toppings.map((topping) => topping.name).join(", ")}</p>
            </div>
          </div>
        ))}
      {props.order && (
        <div>
          {props.order.price ? (
            <p>
              <strong>Total: </strong>$ {props.order.price / 100}
            </p>
          ) : (
            <p>Cart is Empty</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
