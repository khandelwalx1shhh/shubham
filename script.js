// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initNavigation();
  initScrollEffects();
  initContactForm();
  initPaymentForm();
  initAnimations();
});

// Navigation Functions
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");

      // Animate hamburger
      const spans = hamburger.querySelectorAll("span");
      spans.forEach((span, index) => {
        if (navMenu.classList.contains("active")) {
          if (index === 0)
            span.style.transform = "rotate(45deg) translate(5px, 5px)";
          if (index === 1) span.style.opacity = "0";
          if (index === 2)
            span.style.transform = "rotate(-45deg) translate(7px, -6px)";
        } else {
          span.style.transform = "none";
          span.style.opacity = "1";
        }
      });
    });

    // Close mobile menu when clicking on a link
    navMenu.addEventListener("click", function (e) {
      if (e.target.classList.contains("nav-link")) {
        navMenu.classList.remove("active");

        // Reset hamburger animation
        const spans = hamburger.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "none";
          span.style.opacity = "1";
        });
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Scroll Effects
function initScrollEffects() {
  // Scroll to top button
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  if (scrollToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Reveal animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".service-card, .value-card, .expertise-card, .service-detail-card, .feature-item"
  );
  animateElements.forEach((el) => {
    observer.observe(el);
  });
}

// ============================
// CONTACT FORM HANDLER
// ============================
// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("contact-form");
//     if (!form) return; // Exit if form is not on this page

//     const submitBtn = form.querySelector("button[type='submit']");
//     const successMsg = document.getElementById("form-success");
//     const errorMsg = document.getElementById("form-error");

//     // ✅ Your actual Google Apps Script Web App URL
//     const scriptURL = "https://script.google.com/macros/s/AKfycbxizCZoHLVuw5GOwotAtoIk3VX89IF6Y4pM8rwHnA2aS5UhrArKakzNDf-_pfm42BWJ/exec";

//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         // UI updates
//         submitBtn.textContent = "Sending...";
//         submitBtn.disabled = true;
//         successMsg.style.display = "none";
//         errorMsg.style.display = "none";

//         const formData = {
//             name: form.name.value.trim(),
//             email: form.email.value.trim(),
//             phone: form.phone.value.trim(),
//             subject: form.subject.value.trim(),
//             message: form.message.value.trim()
//         };

//         try {
//             const response = await fetch(scriptURL, {
//                 method: "POST",
//                 mode: "cors",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData)
//             });

//             const result = await response.json();
//             if (result.result === "success") {
//                 successMsg.style.display = "block";
//                 form.reset();
//             } else {
//                 errorMsg.style.display = "block";
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             errorMsg.style.display = "block";
//         }

//         // Reset button
//         submitBtn.textContent = "Send Message";
//         submitBtn.disabled = false;
//     });

function validateForm() {
  let valid = true;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();

  if (name.length < 2) {
    alert("Name must be at least 2 characters");
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Enter a valid email");
    valid = false;
  }

  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) {
    alert("Enter a valid phone number");
    valid = false;
  }

  if (message.length < 10) {
    alert("Message must be at least 10 characters");
    valid = false;
  }

  return valid;
}
// Payment Form Functions
// --- Coupon Configuration ---
const coupons = {
  FINGARD5: { type: "percent", value: 5 }, // 5% discount
  FINGARD10: { type: "percent", value: 10 }, // 10% discount
  FINGARD15: { type: "percent", value: 15 }, // 15% discount
};

let appliedCoupon = null;

// Payment Form Functions
function initPaymentForm() {
  const paymentForm = document.getElementById("payment-form");
  const serviceSelect = document.getElementById("service-type");
  const amountInput = document.getElementById("amount");
  // Updated to match the HTML button ID
  const applyCouponBtn = document.getElementById("applyCouponBtn");

  if (paymentForm) {
    const servicePricing = {
      standard: 999,
      multiple: 1599,
      "business-income": 2499,
      "capital-gain": 3299,
      nri: 6499,
      forign: 9999,
      custom: 0,
    };

    if (serviceSelect && amountInput) {
      serviceSelect.addEventListener("change", function () {
        const selectedService = this.value;
        if (selectedService && selectedService !== "custom") {
          amountInput.value = servicePricing[selectedService];
          updatePaymentSummary();
        } else if (selectedService === "custom") {
          amountInput.value = "";
          amountInput.focus();
        }
      });

      amountInput.addEventListener("input", updatePaymentSummary);
    }

    // Apply coupon button event listener updated IDs
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener("click", function () {
        // Updated coupon input ID
        const codeInput = document.getElementById("couponCode");
        const code = codeInput.value.trim().toUpperCase();
        if (coupons[code]) {
          appliedCoupon = coupons[code];
          alert(`Coupon "${code}" applied!`);
          updatePaymentSummary();
        } else {
          appliedCoupon = null;
          alert("Invalid coupon code");
        }
      });
    }

    paymentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validatePaymentForm()) {
        initializeRazorpay();
      }
    });
  }
}
function updatePaymentSummary() {
  const amountInput = document.getElementById("amount");
  const serviceAmountElement = document.getElementById("service-amount");
  const totalAmountElement = document.getElementById("total-amount");

  if (!amountInput || !serviceAmountElement || !totalAmountElement) return;

  let serviceAmount = parseFloat(amountInput.value) || 0;

  // Apply coupon discount
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      serviceAmount -= (serviceAmount * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "flat") {
      serviceAmount -= appliedCoupon.value;
    }
    if (serviceAmount < 0) serviceAmount = 0; // Avoid negative amounts
  }

  // Without GST, total equals the service amount
  serviceAmountElement.textContent = `₹${serviceAmount.toLocaleString(
    "en-IN"
  )}`;
  totalAmountElement.textContent = `₹${serviceAmount.toLocaleString("en-IN")}`;
}

function initializeRazorpay() {
  const form = document.getElementById("payment-form");
  const formData = new FormData(form);

  let amount = parseFloat(formData.get("amount"));

  // Apply coupon discount
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      amount -= (amount * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "flat") {
      amount -= appliedCoupon.value;
    }
    if (amount < 0) amount = 0;
  }

  // Total amount equals the discounted service amount (convert to paise)
  const totalAmount = amount * 100;

  const options = {
    key: "rzp_live_jLAMsymMHO7Wgh",
    amount: totalAmount,
    currency: "INR",
    name: "Fingard Partners",
    description: `Payment for ${formData.get("service-type") || "Services"}`,
    image: "https://i.postimg.cc/507Zf8yt/logo.png",
    handler: handlePaymentSuccess,
    prefill: {
      name: formData.get("client-name"),
      email: formData.get("client-email"),
      contact: formData.get("client-phone"),
    },
    notes: {
      service_type: formData.get("service-type"),
      description: formData.get("description"),
      coupon_code: document.getElementById("couponCode").value.trim(),
    },
    theme: {
      color: "#002147",
    },
  };

  const rzp = new Razorpay(options);
  rzp.on("payment.failed", handlePaymentFailure);
  rzp.open();
}

function handlePaymentSuccess(response) {
  alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);

  // Here you would typically send the payment details to your server
  console.log("Payment successful:", response);

  // Reset form
  document.getElementById("payment-form").reset();
  updatePaymentSummary();

  // Redirect or show success page
  // window.location.href = 'payment-success.html';
}

function handlePaymentFailure(response) {
  alert(`Payment failed: ${response.error.description}`);
  console.log("Payment failed:", response);
}

// Animation Functions
function initAnimations() {
  // Add animation classes to elements as they become visible
  const animatedElements = document.querySelectorAll(
    ".service-card, .value-card, .feature-item"
  );

  animatedElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
  });
}

// Utility Functions
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.textContent = "";
    element.style.display = "none";
  });
}

// Initialize page-specific functionality
function initPageSpecific() {
  const currentPage = window.location.pathname.split("/").pop();

  switch (currentPage) {
    case "contact.html":
      // Contact page specific initialization
      break;
    case "payment.html":
      // Payment page specific initialization
      updatePaymentSummary();
      break;
    case "services.html":
      // Services page specific initialization
      break;
    default:
      // Home page or other pages
      break;
  }
}

// Call page-specific initialization
document.addEventListener("DOMContentLoaded", initPageSpecific);

// Handle window resize for responsive features
window.addEventListener("resize", function () {
  const navMenu = document.getElementById("nav-menu");
  const hamburger = document.getElementById("hamburger");

  if (window.innerWidth > 768) {
    if (navMenu) navMenu.classList.remove("active");
    if (hamburger) {
      const spans = hamburger.querySelectorAll("span");
      spans.forEach((span) => {
        span.style.transform = "none";
        span.style.opacity = "1";
      });
    }
  }
});

// Performance optimization - Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize lazy loading if needed
document.addEventListener("DOMContentLoaded", initLazyLoading);
