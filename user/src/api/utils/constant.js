const responseMessage = {
  ERR_MSG_ISSUE_IN_SIGNUP_API: "Oops! Something went wrong in Sign up API",
  ERR_MSG_ISSUE_IN_LOGIN_API: "Oops! Something went wrong in Log In API",
  ERR_MSG_ISSUE_IN_LOGOUT_API: "Oops! Something went wrong in Log Out API",
  ERR_MSG_ISSUE_IN_TOKEN_VERIFICATION_API:
    "Oops! Something went wrong in token verification API",

  //Error Message for Address Controller
  ERR_MSG_ISSUE_IN_ADD_ADDRESS_API:
    "Oops! Something went wrong in Add Address API",
  ERR_MSG_ISSUE_IN_UPDATE_ADDRESS_API:
    "Oops! Something went wrong in Update Address API",
  ERR_MSG_ISSUE_IN_DELETE_ADDRESS_API:
    "Oops! Something went wrong in Delete Address API",
  ERR_MSG_ISSUE_IN_ADDRESS_LIST_API:
    "Oops! Something went wrong in Address List API",

  //Global
  INVALID_SESSION: "Your session is not valid.",
  BLACKLISTED_TOKEN: "Blacklisted Token.",
  TOKEN_NOT_FOUND: "Bearer Token was not provided.",
  UNAUTHORIZED: "Invalid request. You are not authorized.",
  AUTHORIZED: "Token is Valid.",
  ACCESS_TOKEN_GENERATED: "Access Token Generated Successfully.",

  //User Session Controller
  SIGN_UP_SUCCESS: "User Registration Successfully !!!",
  EMAIL_ALREADY_EXISTS: "Email Already Exists !!!",
  USER_NOT_FOUND: "User Not Found !!!",
  PASSWORD_WRONG: "Password don't match !!!",
  LOG_IN_SUCCESS: "User Logged In Successfully !!!",
  LOG_OUT_SUCCESS: "User Logged Out Successfully !!!",

  //Address Controller
  ADD_ADDRESS: "Address Added Successfully !!!",
  UPDATE_ADDRESS: "Address Updates Successfully !!!",
  DELETE_ADDRESS: "Address Deleted Successfully !!!",
  LIST_ADDRESS: "Address List Fetched Successfully !!!",
  ADDRESS_NOT_FOUND: "Address Not Found !!!",
};

export default responseMessage;
