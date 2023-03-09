'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// FLUX BANKING APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2023-01-02T14:18:46.235Z',
    '2023-01-10T16:33:06.386Z',
    '2023-01-20T14:43:26.374Z',
    '2023-01-23T18:49:59.371Z',
    '2023-01-24T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
/////////////////////////////////////////////////////////

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containertransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////////////

//functions
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = function (date1, date2) {
    Math.round(Math.abs(((date2 - date1) / 1000) * 60 * 60 * 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  //internationalizing date formats
  return new Intl.DateTimeFormat(locale).format(date);
};

const formattedCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayTransactions = function (acc, sort = false) {
  containertransactions.innerHTML = ' ';

  const sortedTrans = sort
    ? acc.transactions.slice().sort((a, b) => a - b)
    : acc.transactions;

  //looping over the transactions
  sortedTrans.forEach(function (trans, i) {
    const type = trans > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedTrans = formattedCurrency(trans, acc.locale, acc.currency);

    //creating an html template
    const html = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="transactions__date">${displayDate}</div>
      <div class="transactions__value">${formattedTrans}</div>
    </div>
    `;

    containertransactions.insertAdjacentHTML('afterbegin', html);
  });
};

const computeDispayBalance = function (accounts) {
  accounts.balance = accounts.transactions.reduce(
    (acc, trans, i, arr) => acc + trans,
    0
  );
  labelBalance.textContent = formattedCurrency(
    accounts.balance,
    accounts.locale,
    accounts.currency
  );
};

const calcdisplaySummary = function (acc) {
  const incomes = acc.transactions
    .filter(tran => tran > 0)
    .reduce((acc, tran) => acc + tran, 0);
  labelSumIn.textContent = formattedCurrency(incomes, acc.locale, acc.currency);
  // `${incomes} EUR`;
  const outGoing = acc.transactions
    .filter(tran => tran < 0)
    .reduce((acc, tran) => acc + tran);
  labelSumOut.textContent = formattedCurrency(
    Math.abs(outGoing),
    acc.locale,
    acc.currency
  );

  const interestSummary = acc.transactions
    .filter(rate => rate > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formattedCurrency(
    interestSummary,
    acc.locale,
    acc.currency
  );
};

const updateUi = function (acc) {
  //display transcations
  displayTransactions(acc);
  //display summary
  calcdisplaySummary(acc);
  //display balance
  computeDispayBalance(acc);
};

//computing the username
const createUsername = function (accounts) {
  accounts.forEach(function (accountArray) {
    //compute the username in the accountsArray
    accountArray.username = accountArray.owner
      //converting the owner data to lowercase
      .toLowerCase()
      //spliting by space
      .split(' ')
      //map through and obtain the first letter
      .map(letter => letter[0])
      //join into a string
      .join('');
  });
  console.log(account1.username);
};
createUsername(accounts);
//seperating withdrawals and deposits
const computeTrans = function (accounts) {
  accounts.forEach(function (trans) {
    trans.withdrawals = trans.transactions.filter(withdrawal => withdrawal < 0);
    trans.deposits = trans.transactions.filter(deposit => deposit > 0);
  });
};
computeTrans(accounts);

//implmenting a log out timer
const startLogOutTimer = function () {
  //set the time to one minutes
  let time = 120;

  const tick = () => {
    //set mins and secs
    const mins = String(Math.trunc(time / 60)).padStart(2, 0);
    const secs = String(Math.trunc(time % 60)).padStart(2, 0);

    //to each call, print the remaining time to the UI
    labelTimer.textContent = `${mins}: ${secs}`;

    //stop timer at 0 seconds and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //decrease the timer every second
    time--;
  };

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//EVENT Handlers
let currAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  // console.log(currAccount);
  if (currAccount?.pin === Number(inputLoginPin.value)) {
    //Display the UI
    labelWelcome.textContent = `WELCOME ${currAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // displayNavigation.style.opacity = 0;

    //create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currAccount.locale,
      options
    ).format(now);

    //clear login data fields after verification
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // updateUi
    updateUi(currAccount);
  } else {
    containerApp.style.opacity = 0;
  }
});

// implement transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // implementing transfer conditions
  if (
    amount > 0 &&
    recieverAcc &&
    currAccount.balance >= amount &&
    recieverAcc?.username !== currAccount.username
  ) {
    currAccount.transactions.push(-amount);
    recieverAcc.transactions.push(amount);
  }
  //add transfer dates
  currAccount.movementsDates.push(new Date().toISOString());
  recieverAcc.movementsDates.push(new Date().toISOString());
  //update ui
  updateUi(currAccount);
});

//implement loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  //check loan condition
  if (
    amount > 0 &&
    currAccount.transactions.some(trans => trans >= amount * 0.1)
  ) {
    //credit loan
    setTimeout(function () {
      currAccount.transactions.push(amount);
      //add loan date
      currAccount.movementsDates.push(new Date().toISOString());
      //update UI
      updateUi(currAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

//implement account closing
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currAccount.username === inputCloseUsername.value &&
    currAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
console.log(accounts);

//implement sort functionality
let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransactions(currAccount, sorted);
  sorted = !sorted;
});
