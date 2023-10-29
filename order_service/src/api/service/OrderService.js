import { nanoid } from "nanoid";

const generateRandomOrderId = (length) => {
  return nanoid(length);
};

export { generateRandomOrderId };
