import getRefs from './get-refs';

const refs = getRefs();

export default function galleryImagesMarkup(images) {
  if (!refs.galleryImages && !images) {
    return;
  }
  const markup = images.map(
    image => {
      const { id, largeImageURL, webformatURL, tags, likes, views, comments, downloads } = image;
      return ` <a href=${largeImageURL}  class="link" target="_blank">
                  <div class="item" id=${id}>
                    <img class="item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="item__info">
                      <p class="item__info-text"><b>Likes</b>${likes}</p>
                      <p class="item__info-text"><b>Views</b>${views}</p>
                      <p class="item__info-text"><b>Comments</b>${comments}</p>
                      <p class="item__info-text"><b>Downloads</b>${downloads}</p>
                    </div>
                  </div>
              </a>
        `;
    }).join('');

  refs.galleryImages.insertAdjacentHTML('beforeend', markup);

  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1,
    behavior: "smooth",
  });
}
