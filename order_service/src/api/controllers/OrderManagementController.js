import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constant.js";
import * as ProductService from "../service/ProductService.js";
import * as OrderService from "../service/OrderService.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const orderPlace = async (req, res) => {
  try {
    console.log(
      "================= Place Order: Order Management Controller ================="
    );

    const request = {
      userId: req.sessionData.id,
      transactionId: req.body.transactionId,
    };

    const schema = Joi.object({
      userId: Joi.number().required(),
      transactionId: Joi.string().required(),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Fetch Cart Details
    let cartDetails = await Cart.findOne({ userId: request.userId });

    if (_.isEmpty(cartDetails)) {
      return res.status(400).send({
        message: responseMessage.CART_ITEM_NOT_FOUND,
      });
    }
    cartDetails = cartDetails.toObject();

    //Generate Order Id
    const orderId = OrderService.generateRandomOrderId(6);

    //Calculate total price
    let totalPrice = 0;
    for (const each of cartDetails.items) {
      totalPrice += each.price * each.quantity;
    }
    cartDetails.orderId = orderId;
    cartDetails.transactionId = request.transactionId;
    cartDetails.totalPrice = totalPrice;
    cartDetails.status = "order_placed";

    //Update Items Inventory
    const response = await ProductService.updateProductQuantity(
      cartDetails.items,
      req
    );

    if (!response.status) {
      console.log(response);
      return res.status(400).send({
        message: "Products Not Available",
        data: response.data,
      });
    }

    //Delete Cart
    await Cart.deleteOne({ userId: request.userId });
    //create order
    await Order.create(cartDetails);

    return res.status(200).send({
      message: responseMessage.ORDER_PLACED,
    });
  } catch (err) {
    console.error("Error while placing an order: ", err.message);
    return res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_ORDER_PLACE_API,
    });
  }
};

const orderDetails = async (req, res) => {
  try {
    console.log(
      "================= Order Details: Order Management Controller ================="
    );

    const request = {
      userId: req.sessionData.id,
    };

    const schema = Joi.object({
      userId: Joi.number().required(),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Fetch Order Details
    const orderDetails = await Order.find(
      { userId: request.userId },
      { __v: false }
    );

    return res.status(200).send({
      message: responseMessage.ORDER_DETAILS,
      data: orderDetails,
    });
  } catch (err) {
    console.log("Error Occured in Order Details API:-", err.message);
    return res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_ORDER_DETAILS_API,
    });
  }
};

export { orderPlace, orderDetails };
