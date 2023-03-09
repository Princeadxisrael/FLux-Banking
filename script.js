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
};

const account2 = {
  owner: 'Jessica Davis',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

const displayTransactions = function (transactions, sort = false) {
  containertransactions.innerHTML = ' ';

  const sortedTrans = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;

  //looping over the transactions
  sortedTrans.forEach(function (trans, i) {
    const type = trans > 0 ? 'deposit' : 'withdrawal';
    //creating an html template
    const html = `
    <div class="transactions__row">
      <div class="transactions__type transactions__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="transactions__value">${trans} EUR</div>
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
  labelBalance.textContent = `${accounts.balance} EUR`;
};

const calcdisplaySummary = function (acc) {
  const incomes = acc.transactions
    .filter(tran => tran > 0)
    .reduce((acc, tran) => acc + tran, 0);
  labelSumIn.textContent = `${incomes} EUR`;
  const outGoing = acc.transactions
    .filter(tran => tran < 0)
    .reduce((acc, tran) => acc + tran);
  labelSumOut.textContent = `${Math.abs(outGoing)}EUR`;
  // const balance= incomes+outGoing;
  const interestSummary = acc.transactions
    .filter(rate => rate > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interestSummary}`;
};

const updateUi = function (acc) {
  //display transcations
  displayTransactions(acc.transactions);
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

//EVENT Handlers
let currAccount;

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
    //clear login data fields after verification
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
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
    currAccount.transactions.push(amount);
    //update UI
    updateUi(currAccount);
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
  } else {
    console.log('wrong cred');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
console.log(accounts);

//implement sort functionality
let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransactions(currAccount.transactions, sorted);
  sorted = !sorted;
});
