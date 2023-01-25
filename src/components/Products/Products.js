import React, { useReducer, useEffect, useCallback } from "react";

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

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("Should not be reached!");
  }
};

const Products = () => {
  const [userProducts, dispatch] = useReducer(ProductReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  // const [userProducts, setUserProducts] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDERING PRODUCTS", userProducts);
  }, [userProducts]);

  const filteredProductsHandler = useCallback((filteredProducts) => {
    // setUserProducts(filteredProducts);
    dispatch({ type: "SET", products: filteredProducts });
  }, []);

  const addProductHandler = useCallback((product) => {
    dispatchHttp({ type: "SEND" });
    fetch(
      "https://react-hooks-update-7499a-default-rtdb.europe-west1.firebasedatabase.app/products.json",
      {
        method: "POST",
        body: JSON.stringify(product),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then((responseData) => {
        // setUserProducts(prevProducts => [
        //   ...prevProducts,
        //   { id: responseData.name, ...Product }
        // ]);
        dispatch({
          type: "ADD",
          product: { id: responseData.name, ...product },
        });
      });
  }, []);

  const removeProductHandler = useCallback((productId) => {
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-hooks-update-7499a-default-rtdb.europe-west1.firebasedatabase.app/products//${productId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        // setUserProducts(prevProducts =>
        //   prevProducts.filter(Product => Product.id !== ProductId)
        // );
        dispatch({ type: "DELETE", id: productId });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
      });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  const productHandler = useMemo(() => {
    return (
      <ProductList
        products={userProducts}
        onRemoveItem={removeProductHandler}
      />
    );
  }, [userProducts, removeProductHandler]);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <ProductForm
        onAddProduct={addProductHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadProducts={filteredProductsHandler} />
        {productHandler}
      </section>
    </div>
  );
};

export default Products;
