import React, { useState, createContext, useContext } from "react";
import { userContext } from "./UsersProvider";
export const productContext = createContext();

const productInit = {
  price: "",
  title: "",
  imageURL: "",
};

const ProductProvider = ({ children }) => {
  const { axiosWithAuth, openSnackbar } = useContext(userContext);

  const [product, setProduct] = useState(productInit);

  const submitLink = async (listId, url) => {
    const requestBody = { url: url, listId: listId };
    try {
      const { data } = await axiosWithAuth().post(`/products`, requestBody);
      if (data.productData) {
        setProduct(data.productData);
        return true;
      } else if (data.message) {
        openSnackbar("warning", data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearProduct = () => {
    setProduct(productInit);
  };

  return (
    <productContext.Provider
      value={{
        product,
        submitLink,
        clearProduct,
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export default ProductProvider;
