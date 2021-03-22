import React, { useState, createContext, useContext } from "react";
import { userContext } from "./UsersProvider";
export const productContext = createContext();

const productInit = {
  price: "",
  title: "",
  imageURL: "",
};

const ProductProvider = ({ children }) => {
  const { axiosWithAuth } = useContext(userContext);

  const [product, setProduct] = useState(productInit);

  const submitLink = async (listId, url) => {
    const requestBody = { url: url, listId: listId };

    try {
      const { data } = await axiosWithAuth().post(`/products`, requestBody);
      setProduct(data.productData);
    } catch (error) {
      console.error(error);
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
