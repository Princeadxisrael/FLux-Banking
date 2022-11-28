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
  accounts.balance = accounts.transactions.reduce(
    (acc, trans, i, arr) => acc + trans,
    0
  );
  labelBalance.textContent = `${accounts.balance} EUR`;
};

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
////////////////////////////////////////////////////////
const testData1 = [5, 2, 4, 1, 15, 8, 3];
const testData2 = [16, 6, 10, 5, 6, 1, 4];
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
// const calcAverageHumanAge = ages =>
//   ages
//     .map(Age => (Age <= 2 ? Age * 2 : 16 + Age * 4))
//     .filter(filteredAge => filteredAge >= 18)
//     .reduce(
//       (acc, avgHumanAge, index, arr) => acc + avgHumanAge / arr.length,
//       0
//     );

// const avg1 = calcAverageHumanAge(testData1);
// const avg2 = calcAverageHumanAge(testData2);
// console.log(avg1, avg2);

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// let recommendedFood;
// const calcRecommendFood = function (dog) {
//   for (const value of dog) {
//     value['recommendedFood'] = `${value['weight'] ** 0.75 * 28}g`;
//   }
// };
// calcRecommendFood(dogs);

// const findDog = function (arr) {
//   arr.find(function (dog, i) {
//     dog.owners[i] === 'Maltida';
//     if (dog.curFood > dog.recommendedFood) {
//       console.log(`eating much`);
//     } else {
//       console.log(`eating little`);
//     }
//   });
// };
// findDog(dogs);
// console.log(dogs);

// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
// Your tasks:
// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too
// little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
// the owners array, and so this one is a bit tricky (on purpose) �
// 3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"
// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)
// 7. Create an array containing the dogs that are eating an okay amount of food (try
// to reuse the condition used in 6.)
// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects �
