import React, { createContext, ReactNode, useContext, useState } from 'react'
import ShoppingCart from '../components/ShoppingCart'


type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number,
    quantity: number,
}

type ShoppingCartContext = {
    openCart: () => void,
    closeCart: () => void,
    getItemQuantity: (id: number) => number,
    increaseCartQuantity: (id: number) => void,
    decreaseCartQuantity: (id: number) => void,
    removeFromCart: (id: number) => void,
    cartQuantity: number,
    cartItems: CartItem[],
}

const ShoppingCartContext = createContext({} as ShoppingCartContext)

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext)
}

export const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const openCart = () => setIsOpen(true)

    const closeCart = () => setIsOpen(false)

    const cartQuantity = cartItems.reduce((acc, cur) => acc + cur.quantity, 0)

    function getItemQuantity(id: number) {
        return cartItems.find((item) => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id: number) {
        setCartItems((currItems) => {
            if(!currItems.find((item) => item.id === id)) {
                return [...currItems, { id, quantity: 1}]
            } else {
                return currItems.map((item) => {
                    if(item.id === id) {
                        return {...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                    
                })
            }
        })
    }


    function decreaseCartQuantity(id: number) {
        setCartItems((currItems) => {
            if(currItems.find((currItem) => currItem.id === id)?.quantity === 1) {
                return currItems.filter((currItem) => currItem.id !== id)
            } else {
                return currItems.map((currItem) => {
                    if(currItem.id === id) {
                        return {...currItem, quantity: currItem.quantity - 1}
                    }
                    else return currItem
                })
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems((currItems) => currItems.filter((currItem) => currItem.id !== id))
    }



    return (
        <ShoppingCartContext.Provider 
            value={{ 
                getItemQuantity, 
                increaseCartQuantity, 
                decreaseCartQuantity, 
                removeFromCart, 
                openCart, 
                closeCart, 
                cartQuantity, 
                cartItems 
            }}
        >
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
    )
}
