import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products"


export const CartContext = createContext({
  items: [],
  addItemToCart: ()=>{},
  updateItemQuantity: ()=>{}
});

function shoppingCartReducer(state, action){
  switch (action.type){
    case "ADD_ITEM":
    const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        ...state,
        items: updatedItems,
      };
      break;
      // UPDATE_ITEM_QUANTITY -----------------------------------------------------
    case "UPDATE_ITEM_QUANTITY":
      const cartItems = [...state.items];

      const selectedItemIndex = cartItems.findIndex(item => item.id === action.payload.productId);            
      const selectedItem = cartItems[selectedItemIndex];      

      console.log("Selected Item quantity :", selectedItem.quantity);
      
      if(selectedItem.quantity <= 0){
        cartItems.splice(selectedItemIndex, 1);
      } else{
        selectedItem.quantity += action.payload.amount;
      }

      return {
        ...state,
        items: cartItems
      };

      // const updatedItem = {
      //   ...cartItems[updatedItemIndex],
      // };

      // updatedItem.quantity += parseInt(action.payload.amount);

      // if (updatedItem.quantity <= 0) {
      //   cartItems.splice(updatedItemIndex, 1);
      // } else {
      //   cartItems[updatedItemIndex] = updatedItem;
      // }

      // return {
      //   ...state,
      //   items: cartItems,
      // };
  }
};

export default function CartContextProvider({children}) {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {items:[]});

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: 'ADD_ITEM',
      payload: id
    })
  };

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM_QUANTITY",
      payload: {
        productId,
        amount
      }
    })
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity
  };


  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}