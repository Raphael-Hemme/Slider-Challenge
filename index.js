const url = "https://dummyjson.com/products";
const queryParams = "?limit=10";

let products = [];
let isLoading = true;
let error = "";

const getProducts = async () => {
  console.log("Fetching products...", new Date().toLocaleTimeString());

  try {
    const response = await fetch(`${url}${queryParams}`);
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    products = data.products;
  } catch (err) {
    console.error(err);
    error = err;
  }
};

const constructProductSlide = (product) => {
  const productSlideElement = document.createElement("li");
  productSlideElement.className = "slide-container";
  productSlideElement.innerHTML = `
    <div class="slide-content">
      <h3 class="product-title">${product.title}</h3>
    </div>
  `;
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

const boot = async () => {
  await getProducts();
  const productSlides = products.map((product) => {
    return constructProductSlide(product);
  });
  appendProductSlides(productSlides);
  toggleLoading();
};

boot();
