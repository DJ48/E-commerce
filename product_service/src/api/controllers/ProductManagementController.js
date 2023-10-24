import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constant.js";
import Product from "../models/Product.js";

/**
 * Controller for Adding Product
 */

const addProduct = async (req, res) => {
  try {
    console.log(
      "================= Add Product: Product Management Controller ================="
    );
    console.log(req.body);
    const request = {
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      available: req.body.available,
    };

    const schema = Joi.object({
      name: Joi.string().required(),
      brand: Joi.string().required(),
      description: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(1).required(),
      available: Joi.boolean().default(true),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Check for duplicate product
    const productExists = await Product.findOne({ name: request.name });
    if (!_.isEmpty(productExists)) {
      return res.status(400).send({
        message: responseMessage.PRODUCT_EXIST,
      });
    }

    //Create Product
    await Product.create(request);

    return res.status(200).send({
      message: responseMessage.ADD_PRODUCT,
    });
  } catch (err) {
    console.error("Error while creating new product: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_ADD_PRODUCT_API,
    });
  }
};

/**
 * Controller for Updating Product
 */

const updateProduct = async (req, res) => {
  try {
    console.log(
      "================= Update Product: Product Management Controller ================="
    );
    const request = {
      id: req.body.id,
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      available: req.body.available,
      lastModified: req.body.lastModified,
    };

    const schema = Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      brand: Joi.string().required(),
      description: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(1).required(),
      available: Joi.boolean().default(true),
      lastModified: Joi.date().required(),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Check if product exists
    const productDetails = await Product.findOne({ _id: request.id });

    if (_.isEmpty(productDetails)) {
      return res.status(400).send({
        message: responseMessage.PRODUCT_NOT_FOUND,
      });
    }

    //Check if product is updated
    if (
      productDetails.updatedAt.toISOString() !==
      new Date(request.lastModified).toISOString()
    ) {
      return res.status(400).send({
        message: responseMessage.PRODUCT_MODIFIED,
      });
    }

    //Update Product
    await Product.findOneAndUpdate({ _id: request.id }, _.omit(request, "id"));

    return res.status(200).send({
      message: responseMessage.UPDATE_PRODUCT,
    });
  } catch (err) {
    console.error("Error while updating product: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_UPDATE_PRODUCT_API,
    });
  }
};

/**
 * Controller for deleting product
 */

const deleteProduct = async (req, res) => {
  try {
    const request = {
      id: req.query.id,
    };

    const schema = Joi.object({
      id: Joi.string().required(),
    });

    const validateRequest = schema.validate(request);
    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Check if product exists
    const productExists = await Product.findOne({
      _id: request.id,
    });

    if (_.isEmpty(productExists)) {
      return res.status(400).send({
        message: responseMessage.PRODUCT_NOT_FOUND,
      });
    }

    await Product.findOneAndDelete({ _id: request.id });

    return res.status(200).send({
      message: responseMessage.DELETE_PRODUCT,
    });
  } catch (err) {
    console.error("Error while deleting product: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_DELETE_PRODUCT_API,
    });
  }
};

/**
 * Controller for Product List
 */

const fetchProductList = async (req, res) => {
  try {
    //Fetch Product List
    const productList = await Product.find({}, { __v: false });
    const totalCount = await Product.count();

    return res.status(200).send({
      message: responseMessage.LIST_PRODUCT,
      data: {
        count: totalCount,
        items: productList,
      },
    });
  } catch (err) {
    console.error("Error while fetching product list: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_PRODUCT_LIST_API,
    });
  }
};

/**
 * Controller for fetching product by id
 */

const fetchProductById = async (req, res) => {
  try {
    const request = {
      id: req.query.id,
    };

    const schema = Joi.object({
      id: Joi.string().required(),
    });

    const validateRequest = schema.validate(request);
    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Fetch product details
    const productDetails = await Product.findOne(
      {
        _id: request.id,
      },
      { __v: false }
    );

    if (_.isEmpty(productDetails)) {
      return res.status(400).send({
        message: responseMessage.PRODUCT_NOT_FOUND,
      });
    }

    return res.status(200).send({
      message: responseMessage.PRODUCT_DETAILS,
      data: productDetails,
    });
  } catch (err) {
    console.error("Error while fetching product by id: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_PRODUCT_DETAILS_API,
    });
  }
};

export {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProductList,
  fetchProductById,
};
