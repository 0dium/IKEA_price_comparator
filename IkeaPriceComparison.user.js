// ==UserScript==
// @name      IKEA Price Compare
// @contributors  [Alexandre Eliot, Storm]
// @description   Add a select list to compare prices of IKEA articles
// @version   2.0.0
// @grant     none
// @author    Storm
// @author    Alexandre Eliot
// @match     https://www.ikea.com/*/*/p/*
// ==/UserScript==
window.addEventListener("load", function () {

  // retrieve the product id from the page
  const productId = document.getElementsByClassName("js-product-pip")[0].dataset.productNo;

  const defaultCurrencies = ["AFN", "ALL", "DZD", "USD", "EUR", "AOA", "XCD", "ARS", "AMD", "AWG", "AUD", "AZN", "BSD", "BHD", "BDT", "BBD", "BYN", "BZD", "XOF", "BMD", "BTN", "INR", "BOB", "BOV", "BAM", "BWP", "NOK", "BRL", "BND", "BGN", "BIF", "CVE", "KHR", "XAF", "CAD", "KYD", "CLF", "CLP", "CNY", "COP", "COU", "KMF", "CDF", "NZD", "CRC", "HRK", "CUC", "CUP", "ANG", "CZK", "DKK", "DJF", "DOP", "EGP", "SVC", "ERN", "ETB", "FKP", "FJD", "XPF", "GMD", "GEL", "GHS", "GIP", "GTQ", "GBP", "GNF", "GYD", "HTG", "HNL", "HKD", "HUF", "ISK", "IDR", "XDR", "IRR", "IQD", "ILS", "JMD", "JPY", "JOD", "KZT", "KES", "KPW", "KRW", "KWD", "KGS", "LAK", "LBP", "LSL", "ZAR", "LRD", "LYD", "CHF", "MOP", "MGA", "MWK", "MYR", "MVR", "MRU", "MUR", "XUA", "MXN", "MXV", "MDL", "MNT", "MAD", "MZN", "MMK", "NAD", "NPR", "NIO", "NGN", "OMR", "PKR", "PAB", "PGK", "PYG", "PEN", "PHP", "PLN", "QAR", "MKD", "RON", "RUB", "RWF", "SHP", "WST", "STN", "SAR", "RSD", "SCR", "SLE", "SGD", "XSU", "SBD", "SOS", "SSP", "LKR", "SDG", "SRD", "SZL", "SEK", "CHE", "CHW", "SYP", "TWD", "TJS", "TZS", "THB", "TOP", "TTD", "TND", "TRY", "TMT", "UGX", "UAH", "AED", "USN", "UYI", "UYU", "UZS", "VUV", "VEF", "VED", "VND", "YER", "ZMW", "ZWL"];

  // The currency you want the article's price to be shown in (the currency you use)
  let currency = defaultCurrencies[0];

  // The base currency used in the country you are comparing to (the one you put in above ^^ )
  // List of currency codes: https://www.iban.com/currency-codes
  let pageCurrencyCode = "EUR";

  // The current exchange rate
  let exchangeRate = 1;

  // Country we wish to compare the price to
  // The format is '\w{2}/\w{2}'
  const defaultCountries = ["ae/ar", "bh/ar", "dj/ar", "dz/ar", "eg/ar", "eh/ar", "er/ar", "il/ar", "iq/ar", "jo/ar", "km/ar", "kw/ar", "lb/ar", "ly/ar", "ma/ar", "mr/ar", "om/ar", "ps/ar", "qa/ar", "sa/ar", "sd/ar", "so/ar", "ss/ar", "sy/ar", "td/ar", "tn/ar", "ye/ar", "in/as", "by/be", "bg/bg", "ml/bm", "bd/bn", "in/bn", "cn/bo", "in/bo", "fr/br", "ad/ca", "es/ca", "fr/ca", "it/ca", "ru/ce", "cz/cs", "gb/cy", "dk/da", "at/de", "be/de", "ch/de", "de/de", "it/de", "li/de", "lu/de", "bt/dz", "gh/ee", "tg/ee", "cy/el", "gr/el", "ag/en", "ai/en", "as/en", "at/en", "au/en", "bb/en", "be/en", "bi/en", "bm/en", "bs/en", "bw/en", "bz/en", "ca/en", "cc/en", "ch/en", "ck/en", "cm/en", "cx/en", "cy/en", "de/en", "dg/en", "dk/en", "dm/en", "er/en", "fi/en", "fj/en", "fk/en", "fm/en", "gb/en", "gd/en", "gg/en", "gh/en", "gi/en", "gm/en", "gu/en", "gy/en", "hk/en", "ie/en", "il/en", "im/en", "in/en", "io/en", "je/en", "jm/en", "ke/en", "ki/en", "kn/en", "kr/en", "ky/en", "lc/en", "lr/en", "ls/en", "mg/en", "mh/en", "mo/en", "mp/en", "ms/en", "mt/en", "mu/en", "mw/en", "my/en", "na/en", "nf/en", "ng/en", "nl/en", "nr/en", "nu/en", "nz/en", "pg/en", "ph/en", "pk/en", "pn/en", "pr/en", "pw/en", "rw/en", "sb/en", "sc/en", "sd/en", "se/en", "sg/en", "sh/en", "si/en", "sl/en", "ss/en", "sx/en", "sz/en", "tc/en", "tk/en", "to/en", "tt/en", "tv/en", "tz/en", "ug/en", "um/en", "us/en", "vc/en", "vg/en", "vi/en", "vu/en", "ws/en", "za/en", "zm/en", "zw/en", "ar/es", "bo/es", "br/es", "bz/es", "cl/es", "co/es", "cr/es", "cu/es", "do/es", "ea/es", "ec/es", "es/es", "gq/es", "gt/es", "hn/es", "ic/es", "mx/es", "ni/es", "pa/es", "pe/es", "pr/es", "py/es", "sv/es", "us/es", "uy/es", "ve/es", "ee/et", "es/eu", "af/fa", "ir/fa", "cm/ff", "gn/ff", "mr/ff", "sn/ff", "fi/fi", "dk/fo", "fo/fo", "be/fr", "bf/fr", "bi/fr", "bj/fr", "bl/fr", "ca/fr", "cd/fr", "cf/fr", "cg/fr", "ch/fr", "ci/fr", "cm/fr", "dj/fr", "dz/fr", "fr/fr", "ga/fr", "gf/fr", "gn/fr", "gp/fr", "gq/fr", "ht/fr", "km/fr", "lu/fr", "ma/fr", "mc/fr", "mf/fr", "mg/fr", "ml/fr", "mq/fr", "mr/fr", "mu/fr", "nc/fr", "ne/fr", "pf/fr", "pm/fr", "re/fr", "rw/fr", "sc/fr", "sn/fr", "sy/fr", "td/fr", "tg/fr", "tn/fr", "vu/fr", "wf/fr", "yt/fr", "nl/fy", "ie/ga", "gb/gd", "es/gl", "in/gu", "im/gv", "gh/ha", "ne/ha", "ng/ha", "il/he", "in/hi", "ba/hr", "hr/hr", "hu/hu", "am/hy", "ng/ig", "cn/ii", "id/in", "is/is", "ch/it", "it/it", "sm/it", "va/it", "il/iw", "jp/ja", "ge/ka", "ke/ki", "kz/kk", "gl/kl", "kh/km", "in/kn", "kp/ko", "kr/ko", "in/ks", "gb/kw", "kg/ky", "lt/lt", "lu/lb", "lv/lv", "ug/lg", "mk/mk", "my/ms", "mt/mt", "be/nl", "nl/nl", "no/no", "pl/pl", "ao/pt", "br/pt", "ch/pt", "cv/pt", "gq/pt", "gw/pt", "lu/pt", "mo/pt", "mz/pt", "pt/pt", "st/pt", "tl/pt", "ro/ro", "by/ru", "kg/ru", "kz/ru", "md/ru", "ru/ru", "ua/ru", "sk/sk", "si/sl", "al/sq", "ba/sr", "cs/sr", "me/sr", "rs/sr", "se/sv", "th/th", "tr/tr", "ua/uk", "vn/vi", "hk/zh", "za/zu"];

  // Input the country code of the website you wish to compare to in this format '../..'
  let language = defaultCountries[0];

  let available = true;
  let otherPrice;
  let otherSiteUri = "";

  // #region dom references

  let otherSiteLink, otherPriceSpan;

  // #endregion

  const localeplanetUri = 'https://www.localeplanet.com';
  const localPlanetCurrencyMapUri = localeplanetUri + "/api/auto/currencymap.json";

  // Perhaps we could use http://www.lingoes.net/en/translator/langcode.htm to retrieve the countries code
  // in association with their Countries name

  async function updateExchangeRate() {
    if (
      pageCurrencyCode !== currency &&
      getWithExpiry("exchangeRate") === null
    ) {
      const exchangeRateRequestUri = `https://api.exchangeratesapi.io/latest?base=${pageCurrencyCode}&symbols=${currency}`;

      console.log("Fetching exchange rate...");

      const newExchangeRate = await fetch(exchangeRateRequestUri)
        .then(response => response.json())
        .then(function (result) {
          const helper = result.rates[currency];
          return helper.toString();
        })
        .catch((e) => {
          console.warn('Failed to fetch the exchange rate for the given currencies')
          return null;
        })


      setExchangeRate(newExchangeRate);

      if (newExchangeRate) {
        console.log("Fetched exchange rate and updated it in localStorage");
      }

    }
  }

  async function updateOtherPrice() {

    const searchUri = `https://sik.search.blue.cdtapps.com/${language}/search-result-page?&q=${productId}`;

    console.log("Looking up price...");

    await fetch(searchUri)
      .then((response) => response.json())
      .then((data) => {

        console.debug({ data })

        try {
          const product = data.searchResultPage.products.main.items[0].product;

          otherPrice = product.salesPrice.numeral * exchangeRate;
          otherSiteUri = product.pipUrl;

          pageCurrencyCode = product.salesPrice.currencyCode;

          console.log("Other price found!");
          console.log("Site : " + otherSiteUri);

        } catch {
          available = false;
          otherPrice = null;
        }
      })
      .catch(() => {
        available = false;
        otherPrice = null;
      })

  }

  // #region dom updaters

  function updateOtherSiteButton() {
    let href = 'javascript:void(0)';
    if (available) {
      href = otherSiteUri;
    }
    otherSiteLink.setAttribute('href', href);
  }

  function updateOtherPriceSpan() {
    let priceString = " N/A in other country";
    if (otherPrice) {
      priceString = ` ${currency} ${(otherPrice).toFixed(2)}`;
    }

    otherPriceSpan.innerHTML = priceString;
  }

  // #endregion

  // #region Event Handlers
  async function onCurrencyChange() {
    console.debug('onCurrencyChange')
    await updateExchangeRate();
    updateOtherPriceSpan();
  }

  async function onLanguagechange() {
    console.debug('onLanguagechange')
    await updateOtherPrice();
    updateOtherSiteButton();
    updateOtherPriceSpan();
  }

  function onExchangeRateChange() {
    // Update local storage
    setWithExpiry("exchangeRate", exchangeRate, 24);
  }

  // #endregion

  // #region Setter
  function setCurrency(value) {
    currency = value;
    onCurrencyChange()
  }

  function setLanguage(value) {
    language = value;
    onLanguagechange();
  }

  function setExchangeRate(value) {

    if (value) {

      onExchangeRateChange();

    } else {
      exchangeRate = 1;
    }
  }

  // #endregion

  // insert a meta tag to unable the fetching of locale planet resources
  const metaTag = document.createElement('meta');
  metaTag.setAttribute("http-equiv", "Content-Security-Policy");
  metaTag.setAttribute("content", `
    default-src *.localeplanet.com * self blob: data: gap:;
    style-src *.localeplanet.com * self 'unsafe-inline' blob: data: gap:;
    script-src *.localeplanet.com * self 'unsafe-eval' 'unsafe-inline' blob: data: gap:;
    object-src *.localeplanet.com * self blob: data: gap:;
    img-src *.localeplanet.com * self 'unsafe-inline' blob: data: gap:;
    connect-src *.localeplanet.com * self 'unsafe-inline' blob: data: gap:;
    frame-src *.localeplanet.com * self blob: data: gap:;
  `);

  const priceModuleContainer = document.getElementsByClassName('pip-temp-price-module')?.[0];

  const headElement = document.getElementsByTagName('head')[0];
  headElement.appendChild(metaTag);

  function getCountryCurrenciesList() {
    return fetch(localPlanetCurrencyMapUri)
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.error("Failed to fetch defaultCurrencies map");
        return defaultCurrencies;
      });
  }

  // #region Local storage utils
  function setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl * 1000 * 60 * 60,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > new Date(item.expiry).getTime()) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  // #endregion

  function insertChild(parent, child) {
    if (parent.firstChild) parent.insertBefore(child, parent.firstChild);
    else parent.appendChild(child);
  }

  function renderSelect({
    anchor,
    name,
    options,
    label,
    onChange
  }) {
    const wrapper = document.createElement("div");
    const labelElement = document.createElement("label");
    labelElement.setAttribute('for', name);

    wrapper.appendChild(labelElement);

    const countryLabelSpan = document.createElement("span");
    countryLabelSpan.innerHTML = label;
    labelElement.appendChild(countryLabelSpan);

    const selectElement = document.createElement("select");
    selectElement.setAttribute('name', name)
    for (let optionValue of options) {
      const optionElement = document.createElement("option");
      optionElement.setAttribute('value', optionValue)
      optionElement.innerHTML = optionValue;
      selectElement.appendChild(optionElement);
    }

    selectElement.addEventListener('change', (e) => {
      const value = e.target.value;
      onChange(value);
    });

    labelElement.appendChild(selectElement);

    insertChild(anchor, labelElement);
  }

  async function renderLangMapSelect() {
    const countryCodeList = defaultCountries;

    console.debug({ countryCodeList });

    if (priceModuleContainer && countryCodeList) {
      renderSelect({
        anchor: priceModuleContainer,
        name: 'country-code',
        label: 'Country',
        onChange: (value) => { setLanguage(value) },
        options: countryCodeList
      })
    }
  }

  async function renderCurrencySelect() {
    const currenciesList = await getCountryCurrenciesList();

    console.debug({ currenciesList });

    if (priceModuleContainer && currenciesList) {
      renderSelect({
        anchor: priceModuleContainer,
        name: 'currency',
        label: 'Currency',
        onChange: (value) => { setCurrency(value) },
        options: currenciesList
      })
    }
  }

  function renderOtherPrice({
    anchor,
  }) {

    if (available) {

      otherPriceSpan = document.createElement("span");

      updateOtherPriceSpan();

      anchor.appendChild(otherPriceSpan);
      anchor.lastChild.style.color = "#a00";

    }
  }

  function renderProductLinkButton({ anchor }) {

    const otherSiteButton = document.createElement("button");

    otherSiteLink = document.createElement("a");
    otherSiteLink.innerHTML = 'Take me there';

    updateOtherSiteButton();

    otherSiteButton.appendChild(otherSiteLink)

    anchor.appendChild(otherSiteButton);

  }

  function init() {
    updateExchangeRate();
    updateOtherPrice();
  }

  function render() {
    const priceWrapperClassName = "pip-temp-price-module__price";
    const priceElementClassName = "pip-temp-price-module__primary-currency-price";

    const priceSpan = document.getElementsByClassName(priceElementClassName)[0];
    const priceElement = document.getElementsByClassName(priceWrapperClassName)[0];

    renderLangMapSelect();
    renderCurrencySelect();

    if (priceSpan) {
      renderOtherPrice({ anchor: priceSpan })
    }

    if (priceElement) {
      renderProductLinkButton({ anchor: priceElement })
    }
  }

  render();

  init();

});
