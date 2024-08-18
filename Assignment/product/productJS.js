$(document).ready(function () {
  initializeColorChoose();
  initializeCart();
  initializeSizeButtons();
  initializeShopCart();
  $("#confirm-payment").on("click", handleCheckout);
});

// Chọn màu sắc cho sp
function initializeColorChoose() {
  $(".color-choose input").on("click", function () {
    const productsColor = $(this).data("image");
    $(".active").removeClass("active");
    $(`.left-column img[data-image="${productsColor}"]`).addClass("active");
    $(this).addClass("active");
  });
}

// Tải sp từ Local, gắn skien nút Add to cart
function initializeCart() {
  loadCartFromLocalStorage();
  $(".cart-btn").on("click", handleCartButtonClick);
}

// sử lý các nút trong giỏ
function handleCartButtonClick() {
  const product = $(this).closest(".right-column");
  const productImg = $(".left-column .active").attr("src");
  const productName = product.find("h1").text();
  const productPrice = product.find(".product-price span").text();
  const productSize = product.find(".size-choose button.active").text();
  const productColor = $(".color-choose input:checked").val();

// check size và màu
if (!productSize) {
    alert("Vui lòng chọn size.");
    return;
}

if (!productColor) {
    alert("Vui lòng chọn màu.");
    return;
}

  addItemToCart(productImg, productName, productSize, productPrice);
}

function addItemToCart(productImg, productName, productSize, productPrice) {
  const productColor = $(".color-choose input:checked").val();
  const cartItems = getCartItems();

// check sp để thêm vào giỏ
const existingItem = cartItems.find(
    (item) =>
      item.productName === productName &&
      item.productSize === productSize &&
      item.productColor === productColor
);

if (existingItem) {
    showNotification("Sản phẩm này đã có sẵn trong giỏ hàng.");
    return;
}

const price = parseInt(productPrice.replace(/[^\d]/g, ""));
  cartItems.push({
    productImg,
    productName,
    productSize,
    productColor,
    productPrice: price,
    quantity: 1,
  });
  saveCartItems(cartItems);
  renderCart();
  showNotification("Đã thêm sản phẩm vào giỏ hàng!");
}

// hiển thị sp lên giỏ, giỏ rỗng
function renderCart() {
  const cartItems = getCartItems();
  const cartTable = $(".SHOP-CART tbody").empty();
  
  if (cartItems.length === 0) {
    cartTable.append('<tr><td colspan="5">Không có sản phẩm nào trong giỏ hàng</td></tr>');
    $(".Pay").hide();
  } else {
  cartItems.forEach((item, index) => {
    const formattedPrice = item.productPrice.toLocaleString("vi-VN") + "đ";
    const cartRow = $(`
            <tr>
                <td style="display: flex; align-items: center;">
                    <img style="width: 100px;" src="${item.productImg}" alt="">
                    ${item.productName} (${item.productColor})
                </td>
                <td>${item.productSize}</td>
                <td><input style="width: 60px;" type="number" value="${item.quantity}" min="1" max="10" data-index="${index}"></td>
                <td><span>${formattedPrice}</span></td>
                <td style="cursor: pointer;" class="remove-item" data-index="${index}">Xoá</td>
            </tr>
        `);
    cartTable.append(cartRow);
  });
  $(".Pay").show();
  }
  
  addCartEventListeners();
  updateTotal();
}


// tổng tiền trong giỏ hàng
function updateTotal() {
  const total = getCartItems().reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  $(".totle-price span").text(formatPrice(total));
}


// xóa sp khỏi giỏ
function removeItem(event) {
  const index = $(event.target).data("index");
  const cartItems = getCartItems();
  cartItems.splice(index, 1);
  saveCartItems(cartItems);
  renderCart();
}

// số lượng sp, xóa sp
function addCartEventListeners() {
  $(".remove-item").on("click", removeItem);
  $(".SHOP-CART tbody input[type='number']").on("change", handleQuantityChange);
}

// thay đổi số lượng tối đa là 10
function handleQuantityChange() {
  const index = $(this).data("index");
  const cartItems = getCartItems();
  let newQuantity = parseInt(this.value);

  if (newQuantity > 10) {
    alert("Số lượng tối đa là 10 sản phẩm.");
    newQuantity = 10;
  } else if (newQuantity < 1) {
    alert("Số lượng tối thiểu là 1 sản phẩm.");
    newQuantity = 1;
  }

  cartItems[index].quantity = newQuantity;
  saveCartItems(cartItems);
  updateTotal();
  
  // Cập nhật giá trị hiển thị trên input
  $(this).val(newQuantity);
}

// chọn size
function initializeSizeButtons() {
  $(".size-choose button").on("click", function () {
    $(".size-choose button").removeClass("active");
    $(this).addClass("active");
  });
}

// xử lý mở, đóng giỏ hàng và xử lý nút thanh toán
function initializeShopCart() {
  $("#cart-button").on("click", toggleCartVisibility);
  $(document).on("click", closeCartOnClickOutside);
  $(".SHOP-CART").on("click", stopPropagation);
  $(".Pay").on("click", handleCheckout);
}

// mở đóng giỏ hàng
function toggleCartVisibility() {
  $(".SHOP-CART").toggleClass("hidden visible");
}


// nhấn bên ngoài giỏ hàng sẽ đóng giỏ hàng
function closeCartOnClickOutside(event) {
  if (!$(event.target).closest(".SHOP-CART, #cart-button").length) {
    $(".SHOP-CART").removeClass("visible").addClass("hidden");
  }
}

// Ngăn sự kiện nhấn chuột lan ra các phần tử khác, chỉ ảnh hưởng đến giỏ hàng
function stopPropagation(event) {
  event.stopPropagation();
}



// lưu sp và lấy sp trong local storage
function getCartItems() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(cartItems) {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}


// hiển thị sp trong giỏ hàng từ local storage
function loadCartFromLocalStorage() {
  renderCart();
}

// hiển thị các thông báo
function showNotification(message) {
  const notification = $("#cart-notification");
  notification.text(message);
  notification.addClass("show");

  setTimeout(() => notification.removeClass("show"), 3000);
}

// định dạng giá tiền đ
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}

// kiểm tra xem có sp nào trong giỏ không
function checkCartBeforeCheckout() {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
      alert("Không có sản phẩm nào trong giỏ hàng");
      return false;
    }
    return true;
}

// kiểm tra giỏ hàng chuyển hướng đến trang thanh toán
function handleCheckout(event) {
    event.preventDefault();
    if (checkCartBeforeCheckout()) {
      const totalPrice = $(".totle-price span").text();
      localStorage.setItem("totalPrice", totalPrice);
      window.location.href = "checkout.html";
    }
}
