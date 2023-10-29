import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constant.js";
import * as ProductService from "../service/ProductService.js";
import Cart from "../models/Cart.js";

/**
 * Controller for Adding Product to Cart
 */

const addToCart = async (req, res) => {
  try {
    console.log(
      "================= Add Product to Cart: Cart Management Controller ================="
    );

    const request = {
      userId: req.body.userId,
      productId: req.body.productId,
      quantity: req.body.quantity,
    };

    const schema = Joi.object({
      userId: Joi.number().required(),
      productId: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Fetch product details
    const productDetails = await ProductService.fetchProductDetails(
      request.productId,
      req
    );

    if (_.isEmpty(productDetails)) {
      return res.status(400).send({
        message: "Product Not Found.",
      });
    }

    if (!productDetails.available) {
      return res.status(400).send({
        message: "Product is not available.",
      });
    }

    if (request.quantity > productDetails.quantity) {
      return res.status(400).send({
        message: `Only ${productDetails.quantity} ${
          productDetails.quantity > 0 ? "items" : "item"
        } left in stock.`,
      });
    }

    //Add item to user cart
    const itemDetails = {
      userId: request.userId,
      items: [
        {
          productId: productDetails._id,
          name: productDetails.name,
          description: productDetails.description,
          brand: productDetails.brand,
          price: productDetails.price,
          quantity: request.quantity,
          available: productDetails.available,
        },
      ],
    };

    //Check if user cart exist or not
    const cartDetails = await Cart.findOne({ userId: request.userId });
    
    if (_.isEmpty(cartDetails)) {
      await Cart.create(itemDetails);
    } else {
      const items = cartDetails.items;
      const filter = { userId: request.userId };
      let update = {
        $push: { items: itemDetails.items },
      };
      for (const each of items) {
        if (each.productId === request.productId) {
          filter["items.productId"] = request.productId;
          update = {
            $set: {
              "items.$.quantity": each.quantity + request.quantity,
            },
          };
        }
      }
      await Cart.updateOne(filter, update);
    }

    return res.status(200).send({
      message: responseMessage.ADD_TO_CART,
    });
  } catch (err) {
    console.error("Error while adding new product to cart: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_ADD_TO_CART_API,
    });
  }
};

/**
 * Controller for Updating Cart Item Quanity
 */

const updateCart = async (req, res) => {
  try {
    console.log(
      "================= Update Cart Item Quantity: Cart Management Controller ================="
    );
    const request = {
      userId: req.body.userId,
      productId: req.body.productId,
      quantity: req.body.quantity,
      lastModified: req.body.lastModified,
    };

    const schema = Joi.object({
      userId: Joi.number().required(),
      productId: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      lastModified: Joi.date().required(),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Check if cart exists
    const cartItemDetails = await Cart.findOne({
      userId: request.userId,
      "items.productId": request.productId,
    });

    if (_.isEmpty(cartItemDetails)) {
      return res.status(400).send({
        message: responseMessage.CART_ITEM_NOT_FOUND,
      });
    }

    //Check if product is updated
    if (
      cartItemDetails.updatedAt.toISOString() !==
      new Date(request.lastModified).toISOString()
    ) {
      return res.status(400).send({
        message: responseMessage.CART_MODIFIED,
      });
    }

    const filteredProduct = cartItemDetails.items.filter(
      (each) => each.productId === request.productId
    );

    //Update Product Quantity
    await Cart.findOneAndUpdate(
      { userId: request.userId, "items.productId": request.productId },
      {
        $set: {
          "items.$.quantity": filteredProduct[0].quantity + request.quantity,
        },
      }
    );

    return res.status(200).send({
      message: responseMessage.UPDATE_CART,
    });
  } catch (err) {
    console.error("Error while updating cart item quanity: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_UPDATE_CART_API,
    });
  }
};

/**
 * Controller for deleting cart item
 */

const deleteCartItem = async (req, res) => {
  try {
    const request = {
      userId: req.sessionData.id,
      productId: req.query.productId,
    };

    const schema = Joi.object({
      userId: Joi.number().required(),
      productId: Joi.string().required(),
    });

    const validateRequest = schema.validate(request);
    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Check if cart item exists
    const cartItemExists = await Cart.count({
      userId: request.userId,
      "items.productId": request.productId,
    });

    if (!cartItemExists) {
      return res.status(400).send({
        message: responseMessage.CART_ITEM_NOT_FOUND,
      });
    }

    await Cart.updateOne(
      {
        userId: request.userId,
      },
      { $pull: { items: { productId: request.productId } } }
    );

    return res.status(200).send({
      message: responseMessage.DELETE_CART,
    });
  } catch (err) {
    console.error("Error while deleting product: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_DELETE_CART_API,
    });
  }
};

/**
 * Controller for Cart Details
 */

const fetchCartDetails = async (req, res) => {
  try {
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

    //Check if cart item exists
    const cartItemExists = await Cart.findOne({
      userId: request.userId,
    });

    if (_.isEmpty(cartItemExists)) {
      return res.status(400).send({
        message: responseMessage.CART_ITEM_NOT_FOUND,
      });
    }

    let cartDetails = await Cart.find(
      {
        userId: request.userId,
      },
      { _id: false, __v: false }
    );

    cartDetails = cartDetails[0].toObject();

    let totalPrice = 0;

    for (const each of cartDetails.items) {
      totalPrice += each.quantity * each.price;
    }
    cartDetails.totalPrice = totalPrice;

    return res.status(200).send({
      message: responseMessage.CART_DETAILS,
      data: cartDetails,
    });
  } catch (err) {
    console.error("Error while fetching cart details: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_CART_DETAILS_API,
    });
  }
};

export { addToCart, updateCart, deleteCartItem, fetchCartDetails };
