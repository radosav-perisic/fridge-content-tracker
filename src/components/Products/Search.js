import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../hooks/http';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadProducts } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const {isLoading, data, error, sendRequest, clear} = useHttp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
            sendRequest(
              'https://react-hooks-update-7499a-default-rtdb.europe-west1.firebasedatabase.app/products.json'+ query, 'GET'
            )
          
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, sendRequest, inputRef]);

  useEffect(() => {
    if (!isLoading && !error && data){
      const loadedProducts = [];
      for (const key in data) {
        loadedProducts.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadProducts(loadedProducts);

    }
  }, [data, isLoading, error, onLoadProducts])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
