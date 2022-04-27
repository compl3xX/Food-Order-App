import { useReducer } from 'react';

import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0
};

const cartReducer = (state, action) => {
  if (action.type === 'ADD') {
    const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;

    const existingCartitemIndex = state.items.findIndex((item) => item.id === action.item.id
    )
    const existingCartitem = state.items[existingCartitemIndex];

    let updatedItems;
    if (existingCartitem) {
      const updatedItem = {
        ...existingCartitem,
        amount: existingCartitem.amount + action.item.amount
      }
      updatedItems = [...state.items]
      updatedItems[existingCartitemIndex] = updatedItem;
    } else {

      updatedItems = state.items.concat(action.item);

    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount
    };
  }
  if (action.type === "REMOVE") {

    const existingCartitemIndex = state.items.findIndex(
      (item) => item.id === action.id
    )
    const existingitem = state.items[existingCartitemIndex]
    const updatedTotalAmount = state.totalAmount - existingitem.price
    let updatedItems;
    if (existingitem.amount === 1) {
      updatedItems = state.items.filter(item => item.id !== action.id)
    } else {
      const updateditem = { ...existingitem, amount: existingitem.amount - 1 }
      updatedItems = [...state.items]
      updatedItems[existingCartitemIndex] = updateditem
    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount
    }

  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE', id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
