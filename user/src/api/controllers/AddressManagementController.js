import Joi from "joi";
import _ from "lodash";
import responseMessage from "../utils/constant.js";
import Address from "../models/Address.js";

/**
 * Controller for Adding Address
 */

const addAddress = async (req, res) => {
  try {
    console.log(
      "================= Add Address: Address Management Controller ================="
    );
    const request = {
      userId: req.sessionData.id,
      address: req.body.address,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    };

    const schema = Joi.object({
      userId: Joi.number().required(),
      address: Joi.string().required(),
      zip: Joi.string().min(6).required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Create Address
    await Address.create(request);

    return res.status(200).send({
      message: responseMessage.ADD_ADDRESS,
    });
  } catch (err) {
    console.error("Error while creating new address: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_ADD_ADDRESS_API,
    });
  }
};

/**
 * Controller for Updatinf Address
 */

const updateAddress = async (req, res) => {
  try {
    console.log(
      "================= Update Address: Address Management Controller ================="
    );
    const request = {
      id: req.body.id,
      address: req.body.address,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    };

    const schema = Joi.object({
      id: Joi.string().required(),
      address: Joi.string().required(),
      zip: Joi.string().min(6).required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
    });

    const validateRequest = schema.validate(request);

    if (validateRequest.error) {
      return res.status(400).send({
        message: validateRequest.error.message,
      });
    }

    //Check if address exists
    const doesAddressExists = await Address.findOne({ _id: request.id });

    if (_.isEmpty(doesAddressExists)) {
      return res.status(400).send({
        message: responseMessage.ADDRESS_NOT_FOUND,
      });
    }

    //Update Address
    await Address.findOneAndUpdate({ _id: request.id }, _.omit(request, "id"));

    return res.status(200).send({
      message: responseMessage.UPDATE_ADDRESS,
    });
  } catch (err) {
    console.error("Error while creating new address: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_UPDATE_ADDRESS_API,
    });
  }
};

/**
 * Controller for deleting address
 */

const deleteAddress = async (req, res) => {
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

    //Check if address exists
    const addressExists = await Address.findOne({
      _id: request.id,
    });

    if (_.isEmpty(addressExists)) {
      return res.status(400).send({
        message: responseMessage.ADDRESS_NOT_FOUND,
      });
    }

    await Address.findOneAndDelete({ _id: request.id });

    return res.status(200).send({
      message: responseMessage.DELETE_ADDRESS,
    });
  } catch (err) {
    console.error("Error while deleting todo: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_DELETE_ADDRESS_API,
    });
  }
};

/**
 * Controller for Address List
 */

const fetchAddressList = async (req, res) => {
  try {
    const userId = req.sessionData.id;

    //Fetch Address List
    const addressList = await Address.find({ userId: userId }, { __v: false });

    return res.status(200).send({
      message: responseMessage.LIST_ADDRESS,
      data: addressList,
    });
  } catch (err) {
    console.error("Error while fetching todo list: ", err.message);
    res.status(500).send({
      message: responseMessage.ERR_MSG_ISSUE_IN_ADDRESS_LIST_API,
    });
  }
};

export { addAddress, updateAddress, deleteAddress, fetchAddressList };
