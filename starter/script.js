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
// const displayNavigation = document.getElementsByTagName(nav);

const displayTransactions = function (transactions) {
  //emptying the containertranscations first
  containertransactions.innerHTML = ' ';

  //looping over the transactions
  transactions.forEach(function (trans, i) {
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

const calcdisplaySummary = function (trans) {
  const incomes = trans
    .filter(tran => tran > 0)
    .reduce((acc, tran) => acc + tran, 0);
  labelSumIn.textContent = `${incomes} EUR`;
  const outGoing = trans
    .filter(tran => tran < 0)
    .reduce((acc, tran) => acc + tran);
  labelSumOut.textContent = `${Math.abs(outGoing)}EUR`;
  // const balance= incomes+outGoing;
  // const interestSummary=
};

//computing the username
//create a function that takes an arr and loops through the arr to compute the username
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

const computeDispayBalance = function (accounts) {
  const balance = accounts.reduce((acc, trans, i, arr) => acc + trans, 0);
  labelBalance.textContent = `${balance} EUR`;
};

let currAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currAccount);
  if (currAccount?.pin === Number(inputLoginPin.value)) {
    //Display the UI
    labelWelcome.textContent = `WELCOME ${currAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // displayNavigation.style.opacity = 0;
    //display transcations
    displayTransactions(currAccount.transactions);
    //display summary
    calcdisplaySummary(currAccount.transactions);
    //display balance
    computeDispayBalance(currAccount.transactions);
  }
});
////////////////////////////////////////////////////////
// const testData1 = [5, 2, 4, 1, 15, 8, 3];
// const testData2 = [16, 6, 10, 5, 6, 1, 4];
// const calcAverageHumanAge = function (arr) {
//   let humanAge;
//   let filteredAges;
//   let avgHumanAges;
//   let accumu;
//   humanAge = arr.map(Age => (Age <= 2 ? Age * 2 : 16 + Age * 4));
//   console.log(humanAge);
//   filteredAges = humanAge.filter(filteredAge => filteredAge >= 18);
//   console.log(filteredAges);

//   avgHumanAges = filteredAges.reduce(
//     (acc, avgHumanAge) => acc + avgHumanAge / arr.length,
//     0
//   );
//   console.log(avgHumanAges);
// };
// calcAverageHumanAge(testData1);
// calcAverageHumanAge(testData2);
