const url = 'https://dummyjson.com/products';
const queryParams = '?limit=10';

let products = [];
let isLoading = true;
let error = '';

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

const constructBrandElement = (brand) => {
  const brandHeadingElement = document.createElement('h3');
  brandHeadingElement.className = 'product-brand';
  brandHeadingElement.textContent = brand;
  return brandHeadingElement;
};

const constructProductInfoElement = (price, availabilityStatus) => {
  const productInfoElement = document.createElement('ul');
  productInfoElement.className = 'product-info';

  const priceElement = document.createElement('li');
  priceElement.textContent = `$${price}`;

  const availabilityStatusElement = document.createElement('li');
  availabilityStatusElement.textContent = availabilityStatus;

  productInfoElement.appendChild(priceElement);
  productInfoElement.appendChild(availabilityStatusElement);

  return productInfoElement;
};

const constructProductImageElement = (thumbnail, title) => {
  const productImageElement = document.createElement('img');
  productImageElement.src = thumbnail;
  productImageElement.alt = title;
  productImageElement.className = 'product-image';
  return productImageElement;
};

const constructProductTitleElement = (title) => {
  const productTitleElement = document.createElement('h4');
  productTitleElement.className = 'product-title';
  productTitleElement.textContent = title;
  return productTitleElement;
};

const constructSlideContent = (product) => {
  const slideContentElement = document.createElement('div');
  slideContentElement.className = 'slide-content';

  const brandElement = constructBrandElement(product.brand);
  const productInfoElement = constructProductInfoElement(product.price, product.availabilityStatus);
  const productImageElement = constructProductImageElement(product.thumbnail, product.title);
  const productTitleElement = constructProductTitleElement(product.title);

  slideContentElement.append(
    brandElement,
    productInfoElement,
    productImageElement,
    productTitleElement
  );

  return slideContentElement;
};

const constructProductSlide = (product, index) => {
  const productSlideElement = document.createElement('li');
  productSlideElement.className = 'slide-container';
  productSlideElement.tabIndex = -1;
  productSlideElement.setAttribute('index', index);
  productSlideElement.addEventListener('click', handleSlideClick);

  const slideContentElement = constructSlideContent(product);
  productSlideElement.appendChild(slideContentElement);

  return productSlideElement;
};

const appendProductSlides = (productSlides) => {
  const sliderElement = document.getElementById('slider');
  for (const productSlide of productSlides) {
    sliderElement.appendChild(productSlide);
  }
};

const toggleLoading = () => {
  isLoading = !isLoading;
  const skeletonContainerElement = document.getElementById('skeleton-container');
  skeletonContainerElement.style.display = isLoading ? 'block' : 'none';
};

const constructErrorMsg = (error) => {
  const errorMsgElement = document.createElement('p');
  errorMsgElement.className = 'error-msg';
  errorMsgElement.textContent = error;
  return errorMsgElement;
};

const showError = (error) => {
  const errorMsgElement = constructErrorMsg(error);
  const errorContainerElement = document.getElementById('error-container');
  errorContainerElement.style.display = 'flex';
  errorContainerElement.appendChild(errorMsgElement);
};

const hideError = () => {
  const errorContainerElement = document.getElementById('error-container');
  errorContainerElement.style.display = 'none';
};

const setSliderDisplayTo = (displayProp) => {
  const sliderElement = document.getElementById('slider');
  sliderElement.style.display = displayProp;
};

const scrollFocusedElementIntoView = (focusedElement) => {
  focusedElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  });
};

const getCurrSlideIndexAfterArrowKeyDown = (slideList, arrowKey) => {
  indexChange = arrowKey === 'ArrowRight' ? 1 : -1;
  return (currentIndex + indexChange + slideList.length) % slideList.length;
};

const registerKeyboardScrollEventListeners = () => {
  const slides = document.querySelectorAll('.slide-container');

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      currentIndex = getCurrSlideIndexAfterArrowKeyDown(slides, event.key);
      slides[currentIndex].focus();
      scrollFocusedElementIntoView(slides[currentIndex]);
    } else {
      return;
    }
  });
};

const handleSlideClick = (event) => {
  const slide = event.target.closest('.slide-container');
  currentIndex = parseInt(slide.getAttribute('index'));
  slide.focus();
  scrollFocusedElementIntoView(slide);
};

const boot = async () => {
  await getProducts();

  if (error) {
    setSliderDisplayTo('none');
    toggleLoading();
    showError(error);
    return;
  }

  setSliderDisplayTo('flex');

  const productSlides = products.map((product, index) => {
    return constructProductSlide(product, index);
  });

  appendProductSlides(productSlides);
  registerKeyboardScrollEventListeners();
  toggleLoading();
};

boot();
