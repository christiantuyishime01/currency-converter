const exchangeRates = {
    USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45, INR: 74.5, KRW: 1180, RWF: 1050, BRL: 5.2, MXN: 20.1, SGD: 1.35, NZD: 1.42 },
    EUR: { USD: 1.18, GBP: 0.86, JPY: 129.5, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 7.59, INR: 87.8, KRW: 1390, RWF: 1235, BRL: 6.1, MXN: 23.7, SGD: 1.59, NZD: 1.67 },
    GBP: { USD: 1.37, EUR: 1.16, JPY: 150.7, CAD: 1.71, AUD: 1.85, CHF: 1.26, CNY: 8.84, INR: 102.1, KRW: 1617, RWF: 1437, BRL: 7.1, MXN: 27.5, SGD: 1.85, NZD: 1.95 },
    JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, CAD: 0.011, AUD: 0.012, CHF: 0.0084, CNY: 0.059, INR: 0.68, KRW: 10.7, RWF: 9.55, BRL: 0.047, MXN: 0.18, SGD: 0.012, NZD: 0.013 },
    RWF: { USD: 0.00095, EUR: 0.00081, GBP: 0.0007, JPY: 0.105, CAD: 0.0012, AUD: 0.0013, CHF: 0.00087, CNY: 0.0061, INR: 0.071, KRW: 1.12, BRL: 0.0049, MXN: 0.019, SGD: 0.0013, NZD: 0.0013 }
};

const form = document.getElementById('converterForm');
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const result = document.getElementById('result');
const rateInfo = document.getElementById('rateInfo');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

swapBtn.addEventListener('click', () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    if (amountInput.value && fromCurrency.value && toCurrency.value) {
        convertCurrency();
    }
});

[amountInput, fromCurrency, toCurrency].forEach(element => {
    element.addEventListener('input', () => {
        if (amountInput.value && fromCurrency.value && toCurrency.value) {
            convertCurrency();
        }
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    convertCurrency();
});

function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    result.classList.remove('show');
    rateInfo.classList.remove('show');
    error.style.display = 'none';

    if (!amount || !from || !to) {
        showError('Please fill in all fields');
        return;
    }

    if (from === to) {
        showResult(amount, amount, from, to, 1);
        return;
    }

    loading.style.display = 'block';

    setTimeout(() => {
        loading.style.display = 'none';
        let rate = 1;

        if (exchangeRates[from] && exchangeRates[from][to]) {
            rate = exchangeRates[from][to];
        } else if (exchangeRates[to] && exchangeRates[to][from]) {
            rate = 1 / exchangeRates[to][from];
        } else {
            const toUsdRate = exchangeRates[from]?.USD || 1;
            const fromUsdRate = exchangeRates.USD?.[to] || 1;
            rate = toUsdRate * fromUsdRate;
        }

        const convertedAmount = amount * rate;
        showResult(amount, convertedAmount, from, to, rate);
    }, 500);
}

function showResult(originalAmount, convertedAmount, fromCurr, toCurr, rate) {
    result.innerHTML = `${formatCurrency(originalAmount, fromCurr)} = ${formatCurrency(convertedAmount, toCurr)}`;
    result.classList.add('show');

    rateInfo.innerHTML = `1 ${fromCurr} = ${rate.toFixed(4)} ${toCurr}`;
    rateInfo.classList.add('show');
}

function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
}

// Defaults
fromCurrency.value = 'USD';
toCurrency.value = 'RWF';
amountInput.value = '100';
convertCurrency();
