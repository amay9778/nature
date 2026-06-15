document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. PROMO BANNER ROTATION
  // ==========================================
  const promoSlides = document.querySelectorAll('.promo-slide');
  let currentPromoIndex = 0;

  if (promoSlides.length > 0) {
    setInterval(() => {
      promoSlides[currentPromoIndex].classList.remove('active');
      currentPromoIndex = (currentPromoIndex + 1) % promoSlides.length;
      promoSlides[currentPromoIndex].classList.add('active');
    }, 4000);
  }

  // ==========================================
  // 2. COUPON CODE CLIPBOARD COPY
  // ==========================================
  const couponBox = document.getElementById('couponBox');
  const copiedTooltip = document.getElementById('copiedTooltip');

  if (couponBox) {
    couponBox.addEventListener('click', () => {
      const couponText = 'NEWHABIT250';
      navigator.clipboard.writeText(couponText)
        .then(() => {
          copiedTooltip.classList.add('show');
          setTimeout(() => {
            copiedTooltip.classList.remove('show');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    });
  }

  // ==========================================
  // 3. STICKY HEADER SCROLL EFFECT
  // ==========================================
  const mainHeader = document.getElementById('mainHeader');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 4. MOBILE DRAWER NAVIGATION MENU
  // ==========================================
  const burgerMenuBtn = document.getElementById('burgerMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent scroll
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (burgerMenuBtn) burgerMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer on link click
  const drawerLinks = document.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================
  // 5. HERO CAROUSEL SLIDER (TOUCH & AUTO)
  // ==========================================
  const heroContainer = document.getElementById('heroContainer');
  const slides = document.querySelectorAll('.hero-slide-item');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const dotsContainer = document.getElementById('sliderDotsContainer');

  let currentSlideIndex = 0;
  let autoSlideInterval;
  const slideDuration = 5000;

  // Initialize dots
  if (dotsContainer && slides.length > 0) {
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlidePosition() {
    if (heroContainer) {
      heroContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    // Update dots
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      if (index === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    currentSlideIndex = index;
    updateSlidePosition();
  }

  function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateSlidePosition();
  }

  function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    updateSlidePosition();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // Auto slide loops
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, slideDuration);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (slides.length > 0) {
    startAutoSlide();
  }

  // Touch swipe support for Hero Carousel
  let touchStartX = 0;
  let touchEndX = 0;

  if (heroContainer) {
    heroContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 50; // px
    if (touchStartX - touchEndX > threshold) {
      // Swiped left -> next slide
      nextSlide();
      resetAutoSlide();
    } else if (touchEndX - touchStartX > threshold) {
      // Swiped right -> prev slide
      prevSlide();
      resetAutoSlide();
    }
  }

  // ==========================================
  // 6. BEST SELLERS PRODUCT TAB FILTERING
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all tabs
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');

      const filterValue = btn.dataset.tab;

      productCards.forEach(card => {
        if (filterValue === 'all' || card.dataset.category === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 7. PRODUCT STATE & CART DRAWER SYSTEMS
  // ==========================================
  
  // Data model for products in cart
  // Schema: { id: { id, name, price, qty, img } }
  let cartData = {};

  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const startShopBtn = document.getElementById('startShopBtn');

  // Open/Close Cart Drawer
  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (startShopBtn) {
    startShopBtn.addEventListener('click', () => {
      closeCart();
      document.querySelector('.best-sellers-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function addProductToCart(id, title, price, imgUrl) {
    if (!cartData[id]) {
      cartData[id] = { id, name: title, price, qty: 1, img: imgUrl };
    } else {
      cartData[id].qty += 1;
    }
    updateCartUI();
  }

  function animateOverlayCount(bubble) {
    if (!bubble) return;
    bubble.classList.add('show');
    bubble.classList.add('pulse');
    setTimeout(() => bubble.classList.remove('pulse'), 350);
  }

  // Setup page Product Card event listeners
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const id = card.dataset.id;
    const title = card.querySelector('.product-title').innerText;
    const priceText = card.querySelector('.curr-price').innerText;
    const price = parseInt(priceText.replace('₹', ''));
    const imgUrl = card.querySelector('.product-image').getAttribute('src');
    
    const addBtn = card.querySelector('.add-to-cart-btn');
    const qtySelector = card.querySelector('.quantity-selector');
    const qtyCountSpan = card.querySelector('.qty-count');
    const btnPlus = card.querySelector('.plus');
    const btnMinus = card.querySelector('.minus');
    const overlayAddBtn = card.querySelector('.overlay-add-btn');
    const overlayCountBubble = card.querySelector('.overlay-count-bubble');

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addProductToCart(id, title, price, imgUrl);
        animateOverlayCount(overlayCountBubble);
        openCart();
      });
    }

    if (overlayAddBtn) {
      overlayAddBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        addProductToCart(id, title, price, imgUrl);
        if (overlayCountBubble) {
          overlayCountBubble.innerText = cartData[id].qty;
          overlayCountBubble.classList.add('show');
          overlayCountBubble.classList.add('pulse');
          setTimeout(() => overlayCountBubble.classList.remove('pulse'), 350);
        }
        openCart();
      });
    }

    if (btnPlus) {
      btnPlus.addEventListener('click', () => {
        if (cartData[id]) {
          cartData[id].qty += 1;
          updateCartUI();
        }
      });
    }

    if (btnMinus) {
      btnMinus.addEventListener('click', () => {
        if (cartData[id]) {
          cartData[id].qty -= 1;
          if (cartData[id].qty <= 0) {
            delete cartData[id];
          }
          updateCartUI();
        }
      });
    }
  });

  // Re-renders the cart elements everywhere (badge counts, drawer listing, product quantity selectors)
  function updateCartUI() {
    let totalItems = 0;
    let subtotal = 0;

    // 1. Sync card buttons, selectors, and overlay counts on page
    const allCards = document.querySelectorAll('.product-card');
    allCards.forEach(card => {
      const id = card.dataset.id;
      const addBtn = card.querySelector('.add-to-cart-btn');
      const qtySelector = card.querySelector('.quantity-selector');
      const qtyCountSpan = card.querySelector('.qty-count');
      const overlayCountBubble = card.querySelector('.overlay-count-bubble');

      if (cartData[id]) {
        if (addBtn) addBtn.classList.add('hidden');
        if (qtySelector) qtySelector.classList.remove('hidden');
        if (qtyCountSpan) qtyCountSpan.innerText = cartData[id].qty;
        if (overlayCountBubble) {
          overlayCountBubble.classList.add('show');
          overlayCountBubble.innerText = cartData[id].qty;
        }
      } else {
        if (addBtn) addBtn.classList.remove('hidden');
        if (qtySelector) qtySelector.classList.add('hidden');
        if (overlayCountBubble) {
          overlayCountBubble.classList.remove('show');
          overlayCountBubble.innerText = '0';
        }
      }
    });

    // 2. Compute Totals
    Object.values(cartData).forEach(item => {
      totalItems += item.qty;
      subtotal += item.price * item.qty;
    });

    // 3. Update Badges
    if (cartBadgeCount) {
      const prevCount = parseInt(cartBadgeCount.innerText);
      cartBadgeCount.innerText = totalItems;
      
      // Trigger subtle scale animation if count increases
      if (totalItems > prevCount) {
        cartBadgeCount.classList.add('bounce');
        setTimeout(() => cartBadgeCount.classList.remove('bounce'), 300);
      }
    }
    if (cartDrawerCount) cartDrawerCount.innerText = totalItems;

    // 4. Render Cart Drawer list
    const emptyCartView = document.getElementById('emptyCartView');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartFooter = document.getElementById('cartFooter');
    const subtotalVal = document.getElementById('subtotalVal');
    const freeShipMsg = document.getElementById('freeShipMsg');

    if (totalItems === 0) {
      emptyCartView.classList.remove('hidden');
      cartItemsContainer.classList.add('hidden');
      cartFooter.classList.add('hidden');
    } else {
      emptyCartView.classList.add('hidden');
      cartItemsContainer.classList.remove('hidden');
      cartFooter.classList.remove('hidden');

      // Set prices
      if (subtotalVal) subtotalVal.innerText = `₹${subtotal}`;
      
      // Free shipping calculations (e.g. free above Rs.999)
      const freeShipThreshold = 999;
      if (freeShipMsg) {
        if (subtotal >= freeShipThreshold) {
          freeShipMsg.innerText = '🎉 Congratulations! You qualify for FREE shipping!';
          freeShipMsg.style.color = '#2F6C56'; // Green
        } else {
          const diff = freeShipThreshold - subtotal;
          freeShipMsg.innerText = `Add ₹${diff} more to get FREE shipping!`;
          freeShipMsg.style.color = 'var(--primary)'; // Orange/Red
        }
      }

      // Generate HTML items list
      cartItemsContainer.innerHTML = '';
      Object.values(cartData).forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item-row');
        itemRow.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.img}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-price-row">
              <span class="price">₹${item.price * item.qty}</span>
              <div class="quantity-selector">
                <button class="qty-btn drawer-minus" data-id="${item.id}">-</button>
                <span class="qty-count">${item.qty}</span>
                <button class="qty-btn drawer-plus" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(itemRow);
      });

      // Hook click events inside Drawer item selectors
      const drawerPluses = document.querySelectorAll('.drawer-plus');
      const drawerMinuses = document.querySelectorAll('.drawer-minus');

      drawerPluses.forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (cartData[id]) {
            cartData[id].qty += 1;
            updateCartUI();
          }
        });
      });

      drawerMinuses.forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (cartData[id]) {
            cartData[id].qty -= 1;
            if (cartData[id].qty <= 0) {
              delete cartData[id];
            }
            updateCartUI();
          }
        });
      });
    }
  }

  // ==========================================
  // 8. INTERACTIVE INGREDIENT CARDS
  // ==========================================
  const ingredientCards = document.querySelectorAll('.ingredient-card');
  ingredientCards.forEach(card => {
    card.addEventListener('click', () => {
      ingredientCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // ==========================================
  // 9. REVIEWS CAROUSEL SLIDER (AUTO & DOTS)
  // ==========================================
  const reviewsContainer = document.getElementById('reviewsContainer');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewDotsContainer = document.getElementById('reviewDotsContainer');
  let currentReviewIndex = 0;
  let reviewInterval;

  if (reviewDotsContainer && reviewCards.length > 0) {
    reviewCards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('review-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToReview(index);
        resetReviewTimer();
      });
      reviewDotsContainer.appendChild(dot);
    });
  }

  function updateReviewPosition() {
    if (reviewsContainer) {
      reviewsContainer.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
    }
    // Update dots
    const dots = document.querySelectorAll('.review-dot');
    dots.forEach((dot, index) => {
      if (index === currentReviewIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToReview(index) {
    currentReviewIndex = index;
    updateReviewPosition();
  }

  function nextReview() {
    if (reviewCards.length > 0) {
      currentReviewIndex = (currentReviewIndex + 1) % reviewCards.length;
      updateReviewPosition();
    }
  }

  function startReviewTimer() {
    reviewInterval = setInterval(nextReview, 6000);
  }

  function resetReviewTimer() {
    clearInterval(reviewInterval);
    startReviewTimer();
  }

  if (reviewCards.length > 0) {
    startReviewTimer();
  }

});
