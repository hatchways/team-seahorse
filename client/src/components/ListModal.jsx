import React, { useEffect } from "react";
import PropTypes from "prop-types";
import EditListDialog from "./EditListDialog";
import AddProductDialog from "./AddProductDialog";

const ListModal = () => {
  useEffect(() => {
    //Get the products of the list then setLoading(false)
  }, []);

  return (
    <>
      <AddProductDialog />
    </>
  );
};

export default ListModal;
