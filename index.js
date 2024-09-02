const url = "https://dummyjson.com/products";
const queryParams = "?limit=10";

let products = [];
let isLoading = true;
let error = "";

const getProducts = async () => {
  console.log("Fetching products...", new Date().toLocaleTimeString());

  try {
    const response = await fetch(`${url}${queryParams}`);
    console.log("response", response);
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    products = data.products;
  } catch (err) {
    console.error(err);
    error = err.message;
  }
};

const constructSlideContent = (product) => {
  const slideContentElement = document.createElement("div");
  slideContentElement.className = "slide-content";
  slideContentElement.style.backgroundImage = `url(${product.thumbnail})`;
  slideContentElement.style.backgroundSize = "contain";
  slideContentElement.style.backgroundPosition = "right";
  slideContentElement.style.backgroundRepeat = "no-repeat";
  slideContentElement.style.background;
  slideContentElement.innerHTML = `<h3 class="product-title">${product.title}</h3>`;

  return slideContentElement;
};

const constructProductSlide = (product) => {
  const productSlideElement = document.createElement("li");
  productSlideElement.className = "slide-container";

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

const boot = async () => {
  await getProducts();

  if (error) {
    setSliderDisplayTo("none");
    toggleLoading();
    showError(error);
    return;
  }

  setSliderDisplayTo("flex");
  const productSlides = products.map((product) => {
    return constructProductSlide(product);
  });
  appendProductSlides(productSlides);
  toggleLoading();
};

boot();
