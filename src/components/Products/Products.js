import React, { useReducer, useEffect, useCallback, useMemo } from "react";
import useHttp from "../hooks/http";
import ProductForm from "./ProductForm";
import ProductList from "./ProductsList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ProductReducer = (currentProducts, action) => {
  switch (action.type) {
    case "SET":
      return action.products;
    case "ADD":
      return [...currentProducts, action.product];
    case "DELETE":
      return currentProducts.filter((prod) => prod.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const Products = () => {
  const [userProducts, dispatch] = useReducer(ProductReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} =
    useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === "REMOVE_PRODUCT") {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === "ADD_PRODUCT") {
      dispatch({
        type: "ADD",
        product: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredProductsHandler = useCallback((filteredProducts) => {
    dispatch({ type: "SET", products: filteredProducts });
  }, []);

  const addProductHandler = useCallback(
    (product) => {
      sendRequest(
        "https://react-hooks-update-7499a-default-rtdb.europe-west1.firebasedatabase.app/products.json",
        "POST",
        JSON.stringify(product),
        product,
        "ADD_PRODUCT"
      );
    },
    [sendRequest]
  );

  const removeProductHandler = useCallback(
    (productId) => {
      sendRequest(
        `https://react-hooks-update-7499a-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json`,
        "DELETE",
        null,
        productId,
        "REMOVE_PRODUCT"
      );
    },
    [sendRequest]
  );

  const productList = useMemo(() => {
    return (
      <ProductList
        products={userProducts}
        onRemoveItem={removeProductHandler}
      />
    );
  }, [userProducts, removeProductHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <ProductForm onAddProduct={addProductHandler} loading={isLoading} />

      <section>
        <Search onLoadProducts={filteredProductsHandler} />
        {productList}
      </section>
    </div>
  );
};

export default Products;
