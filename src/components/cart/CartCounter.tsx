import { itemsInCart } from '@/store';
import { CartCookiesClient } from '@/utils';
import { useStore } from '@nanostores/react';
import { useEffect } from 'react';

export const CartCounter = () => {

    const $itemsInCart = useStore(itemsInCart);

    useEffect(() => {
        const cart = CartCookiesClient.getCart();
        itemsInCart.set(cart.length);
    }, []);

    return (
        <a href="/cart" className="relative inline-block">

            {
                $itemsInCart > 0 && (
                    <span
                        className="absolute -top-2 -right-2 flex justify-center items-center bg-blue-600 text-white text-xs rounded-full w-5 h-5"
                    >
                        {$itemsInCart}
                    </span>
                )
            }

            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                <g fill="none" stroke="black" strokeLinecap="round" strokeWidth={1.5}>
                    <path strokeLinejoin="round" d="M3 11h4m14 0H11m-1 3h4m4-5l-3-6M6 9l3-6"></path>
                    <path d="M20.016 16.257c-.487 2.273-.73 3.409-1.555 4.076S16.474 21 14.15 21h-4.3c-2.324 0-3.486 0-4.31-.667c-.826-.667-1.07-1.803-1.556-4.076l-.429-2c-.718-3.353-1.078-5.03-.177-6.143C4.278 7 5.993 7 9.422 7h5.156c3.43 0 5.143 0 6.044 1.114c.67.83.643 1.972.288 3.886"></path>
                </g>
            </svg>
        </a>
    )

}
