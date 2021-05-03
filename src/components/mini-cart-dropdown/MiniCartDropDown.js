import React from 'react';

import './MiniCartDropDown.styless.scss';
import CustomButton from '../custom-button/CustomButton';
import { connect } from 'react-redux';
import CartItem from '../cart-item/CartItem';
import { selectCartItems } from '../../redux/cart/cart.selectors';

const MiniCartDropDown = ({ cartItems }) => (
    <div className='cart-dropdown'>
        <div className='cart-items' >
           {
            cartItems.map(item => <CartItem key={item.id} item={item} />)
           }
        </div>
        <CustomButton>GO TO CHECKOUT</CustomButton>
    </div>
)


const mapStateToProps = state => ({
    // cartItems : state.cart.cartItems
    cartItems : selectCartItems(state)
});

export default connect(mapStateToProps)(MiniCartDropDown);