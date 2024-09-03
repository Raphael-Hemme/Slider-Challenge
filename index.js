const url = "https://dummyjson.com/products";
const queryParams = "?limit=10";

let products = [];
let isLoading = true;
let error = "";

let currentIndex = 0;

const getProducts = async () => {
  try {
    const response = await fetch(`${url}${queryParams}`);
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    products = data.products;
  } catch (err) {
    console.error(err);
    error = err.message;
  }
};

const constructSlideContent = (product) => {
  const slideContentElement = document.createElement("div");
  slideContentElement.className = "slide-content";

  slideContentElement.innerHTML = `
    <h3 class="product-brand">${product.brand}</h3>
    <ul class="product-info">
      <li>$${product.price}</li>
      <li>${product.availabilityStatus}</li>
    </ul>
    <img src="${product.thumbnail}" alt="${product.title}" class="product-image"/>
    <h4 class="product-title">${product.title}</h4>
  `;

  return slideContentElement;
};

const constructProductSlide = (product, index) => {
  const productSlideElement = document.createElement("li");
  productSlideElement.className = "slide-container";
  productSlideElement.tabIndex = -1;
  productSlideElement.setAttribute("index", index);
  productSlideElement.addEventListener("click", handleSlideClick);

  const slideContentElement = constructSlideContent(product);
  productSlideElement.appendChild(slideContentElement);

  return productSlideElement;
};

const appendProductSlides = (productSlides) => {
  const sliderElement = document.getElementById("slider");
  for (const productSlide of productSlides) {
    sliderElement.appendChild(productSlide);
  }
};

const toggleLoading = () => {
  isLoading = !isLoading;
  const skeletonContainerElement =
    document.getElementById("skeleton-container");
  skeletonContainerElement.style.display = isLoading ? "block" : "none";
};

const constructErrorMsg = (error) => {
  const errorMsgElement = document.createElement("p");
  errorMsgElement.className = "error-msg";
  errorMsgElement.textContent = error;
  return errorMsgElement;
};

const showError = (error) => {
  const errorMsgElement = constructErrorMsg(error);
  const errorContainerElement = document.getElementById("error-container");
  errorContainerElement.style.display = "flex";
  errorContainerElement.appendChild(errorMsgElement);
};

const hideError = () => {
  const errorContainerElement = document.getElementById("error-container");
  errorContainerElement.style.display = "none";
};

const setSliderDisplayTo = (displayProp) => {
  const sliderElement = document.getElementById("slider");
  sliderElement.style.display = displayProp;
};

const scrollFocusedElementIntoView = (focusedElement) => {
  focusedElement.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
};

const getCurrSlideIndexAfterArrowKeyDown = (slideList, arrowKey) => {
  indexChange = arrowKey === "ArrowRight" ? 1 : -1;
  return (currentIndex + indexChange + slideList.length) % slideList.length;
};

const registerKeyboardScrollEventListeners = () => {
  const slides = document.querySelectorAll(".slide-container");

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      currentIndex = getCurrSlideIndexAfterArrowKeyDown(slides, event.key);
      slides[currentIndex].focus();
      scrollFocusedElementIntoView(slides[currentIndex]);
    } else {
      return;
    }
  });
};

const handleSlideClick = (event) => {
  const slide = event.target.closest(".slide-container");
  currentIndex = parseInt(slide.getAttribute("index"));
  slide.focus();
  scrollFocusedElementIntoView(slide);
};

const boot = async () => {
  await getProducts();

  if (error) {
    setSliderDisplayTo("none");
    toggleLoading();
    showError(error);
    return;
  }

  setSliderDisplayTo("flex");

  const productSlides = products.map((product, index) => {
    return constructProductSlide(product, index);
  });

  appendProductSlides(productSlides);
  registerKeyboardScrollEventListeners();
  toggleLoading();
};

boot();
