$(document).ready(function() {
    $("#confirm-payment").on("click", handleConfirmPayment);
});

function handleConfirmPayment(event) {
    event.preventDefault();
    
    // Kiểm tra xem form đã được điền đầy đủ chưa
    if (validateForm()) {
        // Hiển thị thông báo đặt hàng thành công
        showOrderSuccessMessage();
        
        // Xóa giỏ hàng
        clearCart();
        
        // Cập nhật giao diện giỏ hàng
        updateCartDisplay();
    }
}

function validateForm() {
    // Thêm logic kiểm tra form ở đây
    // Ví dụ:
    const name = $("#name").val();
    const phone = $("#phone").val();
    const address = $("#address").val();
    
    if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return false;
    }
    
    return true;
}

function showOrderSuccessMessage() {
    alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
}

function clearCart() {
    localStorage.removeItem("cartItems");
}

function updateCartDisplay() {
    // Cập nhật giao diện giỏ hàng (nếu có hiển thị trên trang)
    $(".SHOP-CART tbody").empty();
    $(".totle-price span").text("0đ");
    
    window.location.href = "../index.html";
}