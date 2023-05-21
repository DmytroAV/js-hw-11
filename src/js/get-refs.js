export default function getRefs() {
  return {
    galleryImages: document.querySelector('.gallery'),
    searchForm: document.querySelector('#search-form'),
    loadMoreBtn: document.querySelector('.load-more'),
    arrowTopBtn: document.querySelector('#arrowTop'),
    loader: document.querySelector('.loader'),
  };
}