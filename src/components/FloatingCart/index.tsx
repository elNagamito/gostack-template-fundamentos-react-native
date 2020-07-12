import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();
  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    if (products.length >= 1) {
      const itemPrices = products.map(product => {
        const totalPrice = product.price * product.quantity;
        return totalPrice;
      });
      const totalPrice = itemPrices.reduce((accum, current) => current + accum);
      return formatValue(totalPrice);
    }
    return formatValue(0);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    if (products.length >= 1) {
      const itemQuantities = products.map(product => {
        return product.quantity;
      });
      const totalItens = itemQuantities.reduce(
        (accum, current) => current + accum,
      );
      return totalItens;
    }
    return 0;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
