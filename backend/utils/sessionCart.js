const getSessionCart = (session) => {
    return session.cartData || {};
}

// Hàm cập nhật thông tin giỏ hàng trong session
const updateSessionCart = (session, cartData) => {
    session.cartData = cartData;
}

export { getSessionCart, updateSessionCart };