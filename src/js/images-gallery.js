import API from '../api-service/fetchImages';
import debounce from 'lodash.debounce';
import getRefs from './get-refs';
import galleryImagesMarkup from './markupGallery';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = getRefs();
refs.searchForm.addEventListener('submit', onSearch);

let lightBox = new SimpleLightbox('.gallery a');
let query = null;
let currentPage = 1;
let perPage = 40;
let imagesLeft = 0;
let totalPages = 0;

function onSearch(e) {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value.trim();
  currentPage = 1;
  refs.galleryImages.innerHTML = '';
  if (query === '') {
    Notify.failure('The search string cannot be empty. Please specify your search query.', {
      timeout: 1500,
      showOnlyTheLastOne: true,
    });
    return;
  }

  fetchSearchImages(query);
}

async function fetchSearchImages(query) {
  refs.loader.classList.remove('hidden');
  try {
    const data = await API.fetchImages(query, currentPage, perPage);

    if (data.totalHits === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
        timeout: 1000,
        showOnlyTheLastOne: true,
      });
    } else {
      galleryImagesMarkup(data.hits);
      imagesLeft = data.totalHits;
      totalPages = Math.ceil(data.totalHits / perPage);

      Notify.success(`Hooray! We found ${data.totalHits} images.`, {
        timeout: 1000,
        showOnlyTheLastOne: true,
      });
    }
    lightBox.refresh();
    refs.searchForm.reset();
    refs.loader.classList.add('hidden');
  } catch (error) {
    console.log(error.message)
  } finally {
    refs.searchForm.reset();
  }
}

async function onLoadMore() {
  refs.loader.classList.remove('hidden');
  currentPage += 1;
  try {

    const data = await API.fetchImages(query, currentPage, perPage)

    galleryImagesMarkup(data.hits);
    imagesLeft -= perPage;
    lightBox.refresh();
    refs.loader.classList.add('hidden');

    Notify.success(`Remains ${imagesLeft} images.`, {
      timeout: 1000,
      showOnlyTheLastOne: true,
    });
    if (currentPage > totalPages) {
      Notify.success("We're sorry, but you've reached the end of search results.", {
        timeout: 1000,
        showOnlyTheLastOne: true,
      });
      return;
    }
  } catch (error) {
    Notify.failure(`${error.message}`, {
      timeout: 1000,
      showOnlyTheLastOne: true,
    });
  }
}


// Scroll More //
function handleIfEndOfPage() {
  return (
    window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 550
  );
}

// Функція, яка виконуеться, якщо користувач дійшов до кінця сторінки
function showLoadMorePage() {

  if (query === '') {
    return;
  }
  if (handleIfEndOfPage()) {
    if (currentPage > totalPages || currentPage > 12) {
      refs.loader.classList.add('hidden');
      Notify.success("We're sorry, but you've reached the end of search results.", {
        timeout: 1000,
        showOnlyTheLastOne: true,
      });
      return;
    }
    onLoadMore(currentPage);
  }
}

// Додати подію на прокручування сторінки, яка викликає функцію showLoadMorePage
window.addEventListener('scroll', debounce(showLoadMorePage, 300));


// button 'arrow top' //
arrowTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // після scrollTo відбудеться подія "scroll", тому стрілка автоматично сховається
};

window.addEventListener('scroll', function () {
  refs.arrowTopBtn.hidden = scrollY < document.documentElement.clientHeight;
});
