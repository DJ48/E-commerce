import axios from "axios";

export const fetchProductDetails = async (productId, req) => {
  console.log(
    "================= Fetch Product Details: Product Service ================="
  );
  try {
    const response = await axios({
      method: "get",
      url: `${process.env.PRODUCT_SERVICE_URL}/product/details`,
      headers: {
        Authorization: req.headers.authorization,
      },
      params: {
        id: productId,
      },
    });
    return response.data.data;
  } catch (err) {
    console.log("Error Occured in fetch product details: ", err.message);
  }
};

export const updateProductQuantity = async (itemDetails, req) => {
  console.log(
    "================= Bulk Update Product Quantity: Product Service ================="
  );
  try {
    //Filter item details
    const requestData = itemDetails.map(({ productId, quantity }) => ({
      productId,
      quantity,
    }));
    const response = await axios({
      method: "put",
      url: `${process.env.PRODUCT_SERVICE_URL}/product/bulk/update`,
      headers: {
        Authorization: req.headers.authorization,
      },
      data: { items: requestData },
    });
    return response.data;
  } catch (err) {
    console.log("Error Occured in update product: ", err.message);
  }
};
