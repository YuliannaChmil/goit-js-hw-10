import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputSearch: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  let searchCountry = event.target.value.trim();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  if (searchCountry) {
    fetchCountries(searchCountry)
      .then(renderCountries)
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        console.dir(error.message);
      });
  }
}

function renderCountries(value) {
  if (value.length > 1 && value.length <= 10) {
    countryList(value);
  } else if (value.length === 1) {
    countryCard(value);
  } else {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}

function countryList(value) {
  const markup = value
    .map(
      elem =>
        `<li class="item">
                <img src="${elem.flags.svg}" width="20px">
                <span>${elem.name.official}</span>
            </li>`
    )
    .join('');

  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function countryCard(value) {
  const markup = value
    .map(
      elem =>
        `<div>
                    <img src="${elem.flags.svg}" width="20px">
                    <span> ${elem.name.official} </span>
                    <p> Capital: ${elem.capital} </p>
                    <p> Population: ${elem.population} </p>
                    <p> Languages: ${Object.values(elem.languages).join(
                      ', '
                    )} </p>
                </div>`
    )
    .join('');

  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}
