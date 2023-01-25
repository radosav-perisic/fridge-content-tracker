import React from 'react';

import './ProductsList.css';

const ProductList = props => {
  return (
    <section className="product-list">
      <h2>Loaded Products</h2>
      <ul>
        {props.products.map(prod => (
          <li key={prod.id} onClick={props.onRemoveItem.bind(this, prod.id)}>
            <span>{prod.title}</span>
            <span>{prod.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductList;
