const responseMessage = {
  //Error Message for Cart Management Controller
  ERR_MSG_ISSUE_IN_ADD_TO_CART_API:
    "Oops! Something went wrong in Add to Cart API",
  ERR_MSG_ISSUE_IN_UPDATE_CART_API:
    "Oops! Something went wrong in Update Cart API",
  ERR_MSG_ISSUE_IN_DELETE_CART_API:
    "Oops! Something went wrong in Delete Cart API",
  ERR_MSG_ISSUE_IN_CART_LIST_API: "Oops! Something went wrong in Cart List API",
  ERR_MSG_ISSUE_IN_CART_DETAILS_API:
    "Oops! Something went wrong in Cart Details API",

  //Error Message for Order Management Controller
  ERR_MSG_ISSUE_IN_ORDER_PLACE_API:
    "Oops! Something went wrong in Order Place API",
  ERR_MSG_ISSUE_IN_ORDER_DETAILS_API:
    "Oops! Something went wrong in Order Details API",

  //Global
  INVALID_SESSION: "Your session is not valid.",
  BLACKLISTED_TOKEN: "Blacklisted Token.",
  TOKEN_NOT_FOUND: "Bearer Token was not provided.",
  UNAUTHORIZED: "Invalid request. You are not authorized.",
  ACCESS_TOKEN_GENERATED: "Access Token Generated Successfully.",
  ERROR_OCCURED: "Oops! Something went wrong",

  //Cart Management Controller
  ADD_TO_CART: "Items Added to cart Successfully !!!",
  UPDATE_CART: "Cart items updated Successfully !!!",
  DELETE_CART: "Cart item deleted Successfully !!!",
  LIST_CART: "Cart List Fetched Successfully !!!",
  CART_DETAILS: "Cart Details Fetched Successfully !!!",
  CART_ITEM_NOT_FOUND: "Cart Item Not Found !!!",
  CART_EXIST: "Cart already added !!!",
  CART_MODIFIED: "Conflict. Please refresh the data and try again.",

  // Order Management Controller
  ORDER_PLACED: "Order Placed Successfully !!!",
  ORDER_DETAILS: "Order Details fetched Successfully !!!",
};

export default responseMessage;
