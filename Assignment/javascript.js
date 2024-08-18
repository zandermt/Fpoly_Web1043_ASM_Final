let slideIndex = 1;
showSlides(slideIndex);

let slideInterval;

// Hàm bắt đầu tự động chuyển slide
function startAutoSlide() {
  slideInterval = setInterval(function() {
    plusSlides(1);
  }, 3000);
}

// Hàm dừng tự động chuyển slide
function stopAutoSlide() {
  clearInterval(slideInterval);
}

// tới/lùi
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// Bắt đầu tự động chuyển slide khi trang web được tải
window.onload = startAutoSlide;

// Dừng tự động chuyển khi người dùng tương tác với slide
document.querySelector('.slideshow-container').addEventListener('mouseover', stopAutoSlide);
document.querySelector('.slideshow-container').addEventListener('mouseout', startAutoSlide);