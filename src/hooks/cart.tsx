import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const currentCart = await AsyncStorage.getItem('@GoMarketPlace:cart');

      if (currentCart) {
        setProducts(JSON.parse(currentCart));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productsInCart = [...products];
      const cartIndex = productsInCart.findIndex(
        index => index.id === product.id,
      );
      if (cartIndex === -1) {
        // Se o produto ainda não existe no carrinho, cria um novo registro no array
        const addProductToCart: Product = {
          id: product.id,
          title: product.title,
          image_url: product.image_url,
          price: product.price,
          quantity: 1,
        };
        productsInCart.push(addProductToCart);
        setProducts([addProductToCart]);
      } else {
        // Se o produto já existe no carrinho, adiciona 1 à quantidade total
        productsInCart[cartIndex].quantity += 1;
      }
      // adiciona produtos ao storage
      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(productsInCart),
      );
      setProducts(productsInCart);
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productsInCart = [...products];
      const cartIndex = productsInCart.findIndex(index => index.id === id);
      if (cartIndex !== -1) {
        productsInCart[cartIndex].quantity += 1;
        const addedQuantity = productsInCart[cartIndex];
        setProducts([addedQuantity]);
      }

      // adiciona produtos ao storage
      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(productsInCart),
      );
      setProducts(productsInCart);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productsInCart = [...products];
      const cartIndex = productsInCart.findIndex(index => index.id === id);
      if (cartIndex !== -1) {
        if (productsInCart[cartIndex].quantity >= 2) {
          productsInCart[cartIndex].quantity -= 1;
          const removedQuantity = productsInCart[cartIndex];
          setProducts([removedQuantity]);
        } else {
          productsInCart.splice(cartIndex, 1);
        }
      }

      // adiciona produtos ao storage
      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(productsInCart),
      );
      setProducts(productsInCart);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
