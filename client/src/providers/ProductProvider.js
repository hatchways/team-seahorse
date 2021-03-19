import React, { useState, createContext, useContext } from "react";
import { userContext } from "./UsersProvider";
export const productContext = createContext();

const ProductProvider = ({ children }) => {
  const { axiosWithAuth } = useContext(userContext);

  const [product, setProduct] = useState(null);

  const submitLink = async (linkId, url) => {
    const requestBody = { url: url, linkId: linkId };

    try {
      const { data } = await axiosWithAuth().post(`/products`, requestBody);
      setProduct(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <productContext.Provider
      value={{
        product,
        submitLink,
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export default ProductProvider;
