'use strict';

/**
	
	We will be looking at all the possible methods to handle asynchronous programming in javscript. 
	
	So I have created three blocking operation using our friend `setTimeout` function. 
	which we will be running in series (one after the other) untill all are done. 
	
	The asyncOperation will be completed in 1, 2, 3 respectively. (You can tweak the value by changing the global constants 
	changing it to 0 if you are in a hurry)
	
	We will be running the three asynchronous functions in every available method I can think off. 
	
	The standard way is to read the code, uncomment the functi 
	Let us get this started. 
*/

const TTC_1 = 1; //TIME TO COMPLETE FIRST 
const TTC_2 = 2; //TIME TO COMPLETE SECOND 
const TTC_3 = 3  //TIME TO COMPLETE THIRD

/**************************************************** CALLBACK PATTERN PLAIN ***********************************/

/**
	We all start here. The plain old callback. They are pretty good for some single async. operation. 
	But as the size and complexity of application increases. We go on adding multiple async. opertaion 
	* like a cache layer 
	* fetching from multiple database
	* fetching from external server

	If we want our code to be non blocking (which is the standard way of programming in JS) we can find ourselves 
	in a `Callback Hell` or `Pyramid of Doom` like structure of code
	Read more here : http://callbackhell.com/

*/

function plainCallbackPattern() {
	asyncTaskPlainCallback(TTC_1, function(err, result){
		console.log(result);
		asyncTaskPlainCallback(TTC_2, function(err, result){
			console.log(result);
			asyncTaskPlainCallback(TTC_3, function(err, result) {
				console.log(result);
				console.log(`Completed ${plainCallbackPattern.name}`);
			});
		});
	});
}


function asyncTaskPlainCallback(seconds, callback) {
	setTimeout(() => {
		callback(null, `Done ${asyncTaskPlainCallback.name} in ${seconds} seconds`); 
	}, seconds*1000);
}

// plainCallbackPattern();

/*******************************************************************************************************************/



/**************************************************** CALLBACK PATTERN WITH ERROR HANDLING ***********************************/


/**
	If we add error handling to the above code it can get out of hand pretty quick. 
	Imaging writing this pattern of code for 
*/


const CALLBACK_ERROR = false;

function callbackPattern() {
	asyncTaskCallback(1, (err, result)=>{
		if (err) {
			return console.log(err);
		}
		console.log(result);
		asyncTaskCallback(2, (err, result)=>{
			if (err) {
				return console.log(err);
			}
			console.log(result);
			asyncTaskCallback(3, (err, result)=>{
				if (err) {
					return console.log(err);
				}	
				console.log(result);
				console.log(`Completed ${callbackPattern.name}`);
			});
		});
	});
}


function asyncTaskCallback(seconds, callback) {
	setTimeout(() => {
		if (CALLBACK_ERROR) {
			return callback(new Error('Something went wrong'));
		}
		callback(null, `Done ${asyncTaskCallback.name} in ${seconds} seconds`); 
	}, seconds*1000);
}

// callbackPattern();

/***********************************************************************************************************************************/


/**************************************************** USING ASYNC MODULE PATTERN  **************************************************/


/** 
	So here comes async to the rescue. 
	Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript. 
	It is the popular solution for asynchronous control flow for people writing in ES5. 

	But it does not slove the problem of callbacks. It just makes it easy to figure out the control flow of async functions using 
	methods like `async.series`, async.parallel, async.waterfall etc. which does 99% of the jobs. 

	Take a look at the code below. We are pushing all the async tasks in `asyncTasks` array which we will resolve later. 


*/

const async = require('async');
const ASYNC_ERROR = false; 


function asyncModulePattern() {

	
	let asyncTasks = [];

	asyncTasks.push(asyncTaskAsyncModule.bind(null, 1));
	asyncTasks.push(asyncTaskAsyncModule.bind(null, 2));
	asyncTasks.push(asyncTaskAsyncModule.bind(null, 3));

	async.series(asyncTasks, function(err, resultArr) {
		if (err) {
			return console.log(err);
		}
		console.log(`Completed ${asyncModulePattern.name}`);
	});
	
}

function asyncTaskAsyncModule(seconds, callback) {
	setTimeout(() => {
		if (ASYNC_ERROR) {
			return callback(new Error('Something went wrong'));
		}
		console.log(`Done ${asyncTaskAsyncModule.name} in ${seconds} seconds`)
		callback(null, `Done ${asyncTaskAsyncModule.name} in ${seconds} seconds`); 
	}, seconds*1000);
}

// asyncModulePattern();

/***************************************************************************************************************************/



/**************************************************************** PROMISE PATTERN  *******************************************/

/**
A Promise is in one of these states:

pending: initial state, not fulfilled or rejected.
fulfilled: meaning that the operation completed successfully.
rejected: meaning that the operation failed.
**/

const PROMISE_ERROR = false;

function promisePattern() {
	asyncTaskPromise(1)
		.then((result) => { 
			console.log(result);
			return asyncTaskPromise(2)
		})
		.then((result) => { 
			console.log(result);
			return asyncTaskPromise(3)
		})
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		})
}


function asyncTaskPromise(seconds) {
	return new Promise((resolve, reject) => {
		setTimeout(()=>{
			if (PROMISE_ERROR) {
				reject(new Error('Something went wrong'));
			}
			resolve(`Done ${asyncTaskPromise.name} in ${seconds} seconds`);
		}, seconds*1000);
	});
}


// promisePattern();

/********************************************** GENERATOR PATTERN *****************************************************************/

const GENERATOR_ERROR = false;

function generatorPattern() {
	
	function asyncTaskGenerator(seconds) {
		setTimeout(()=>{
			if (GENERATOR_ERROR) {
				it.throw(new Error('Something went wrong'));
			}
			it.next(`Done ${asyncTaskGenerator.name} in ${seconds} seconds`);
		}, seconds*1000);
	}
	
	function *generator() {
		try {
			console.log(yield asyncTaskGenerator(1)); 
			console.log(yield asyncTaskGenerator(2));
			console.log(yield asyncTaskGenerator(3));	
			console.log(`Completed ${genProPattern.name}`);
		}
		catch(err) {
			console.log(err);
		}
	}

	let it = generator();
	it.next();
}

// generatorPattern();

/*****************************************************************************************************************/


/********************************************** GENERATOR + PROMISES PATTERN (PART-I) ***************************************/

/*
	So here we will be using our old `asyncTaskPromise` function
	 we created while understanding PROMISE PATTERN
*/	

function *generator() {
	try {
		console.log(yield asyncTaskPromise(1)); 
		console.log(yield asyncTaskPromise(2));
		console.log(yield asyncTaskPromise(3));	
	}
	catch(err) {
		console.log(err);
	}
	
}

function genProPattern() {
	let it = generator();
	let p1 = it.next().value; //Returns promise
	p1.then((result_1)=>{
		let p2 = it.next(result_1).value;  		//Returns second promise and the result to the first yield
		p2.then((result_2) => {
			let p3 = it.next(result_2).value;		//Returns third promise and the result to the second yield
			p3.then((result_3)=>{
				it.next(result_3).value;			//All done. Add result to the third yield
				console.log(`Completed ${genProPattern.name}`);
			});
		});
	});
}

// genProPattern();

/** 
	WTF!! Are we back to callback hell ?  
	
	Relax dude. 
	
	Check out the `*generator function`, it remained the same except that 
	incase of yielding `asyncTaskGenerator` we are now yielding `asyncTaskPromise`. 
	
	Don't worry about `genProPattern()` , what we are doing, is waiting for promise to complete then calling 
	it.next() then waiting again then calling it.next() again till it is completed. 

	What we can do is create our very own runGeneratorFunction() iterate through all our promises, `resolve` 
	them and run to completion for us. It will also throw error if our promises `reject` us.
*/

/*****************************************************************************************************************/


/********************************************** GENERATOR + PROMISES PATTERN (PART-II) ***************************************/


/**
	So here we have our `runGenerator` which take our generator and runs it complettion. 
	// Taken from : https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch4.md
	This `runGenerator` can be quite complex for you and and beginners like me. But here is how I understood it. 

	Seein the pattern in `genProPattern` I could figure out that we need to iterate the generator unitill it is done. 
	We know that generator has returns an object which has done property telling it is true or false 

	Generator not completed.
	
	`{
		value : Promise  
		done : false
	}`

	Completed generator 
	
	`{  done : true }`

*/

function runGenerator(gen) {
	var args = [].slice.call( arguments, 1), it;

	// initialize the generator in the current context
	// Creating an iterator. 
	// Query : Why just not only do this ? it = gen();
	it = gen.apply( this, args );

	// return a promise for the generator completing
	return Promise.resolve()
		.then( function handleNext(value){
			//first time it will run the value will be undefined. 
			// run to the next yielded value
			var next = it.next( value );

			return (function handleResult(next){
				// generator has completed running?
				if (next.done) {
					return next.value;
				}
				// otherwise keep going
				else {	
					return Promise.resolve( next.value )
						.then(
							// Doing Recursion. 
							// resume the async loop on
							// success, sending the resolved
							// value back into the generator
							handleNext,

							// if `value` is a rejected
							// promise, propagate error back
							// into the generator for its own
							// error handling
							function handleErr(err) {
								return Promise.resolve(
									it.throw( err )
								)
								.then( handleResult );
							}
						);
				}
			})(next);
		} );
}

function genProPatternSecond() {
	
	var ourGenerator = function *generator() {
		console.log(yield asyncTaskPromise(1)); 
		console.log(yield asyncTaskPromise(2));
		console.log(yield asyncTaskPromise(3));	
	}

	runGenerator(ourGenerator)
		.then(()=>{ console.log('Done'); 
		})
		.catch((err)=>{ 	
			console.log('Errror found ' +err);
		});
}

// genProPatternSecond();

/**
 	You don't need to worry about out the `runGenerator` function, or it's complexity. There are plenty of libraries out there
 	which does this better. 
 	Let us take a look at them next. 
*/

/*******************************************************************************************************************************/

/***************************************** GENERATOR + PROMISES PATTERN  (PART-III) (CO LIBRARY) *********************************/

/**
	`co` is the most poplar generator control flow library out there written by TJ. 
	
	The official repository [here](https://github.com/tj/co) says this : 
	`Generator based control flow goodness for nodejs and the browser, using promises, 
	letting you write non-blocking code in a nice-ish way.`
	
	Think of it as our very own runGenerator function written in a much better way. 
	Take a look at its code in your free time.

	`co` wraps the generator and returns a promise. 
	`co.wrap` wraps the generator and returns a function which on calling runs a generator and returns a promise. 

*/
const co = require('co');

function genProPatternUsingCo() {
	
	var coWrap = co.wrap(function *() {
		console.log(yield asyncTaskPromise(1)); 
		console.log(yield asyncTaskPromise(2));
		console.log(yield asyncTaskPromise(3));	
	});
	
	coWrap()
		.then(()=>{ console.log(`Done using ${genProPatternUsingCo.name}`); 
		})
		.catch((err)=>{ 	
			console.log('Errror found ' +err);
		});
}

// genProPatternUsingCo();


/*********************************************************************************************************************************/

/***************************************************** ASYNC - AWAIT PATTERN ******************************************************/

/** 
	async-await is the upcoming feature in ES7. 
	Basically what is does is take away the complexity of generators, while working the same way as we have seen in the above code. 

	`async` tells the function is asynchronous.
	`await` pauses the function and waits for the promises to complete. 
	 After everything is done, it returns a promise, which is resolved if there is no error or it will be rejected. 
 	
 	This is will let you write asynchrnous code in a synchronous manner. 
 		* No callbacks. 
 		* No multiple error handling redundant code. 
 		* Makes the code readable again.  
*/ 

async function asyncAwaitPattern() {
	try{
		console.log(await asyncTaskPromise(1));
		console.log(await asyncTaskPromise(2));
		console.log(await asyncTaskPromise(3));
		console.log(`Done using ${asyncAwaitPattern.name}`)
	}
	catch(err) {
		console.log(err);
	}
}

// asyncAwaitPattern();



function *randomgen() {
	console.log(yield 'Run first task');
	console.log(yield 'Run second task');
	console.log(yield 'Run third task');
}

// Generator control flow for sync task. 
function runIterative(gen) {
	let it = gen();
	let initial = it.next();
	let count = 0;
	while(initial.done !== true) {
		console.log(initial.value);
		initial = it.next('Done ' + count++ + ' task' );
	}
}

// Generator contorl flow for sync task.
function runRecursive(gen) {
	let it = gen();
	let genObj = it.next();
	let count = 0;
	return (function handler(genObj) {
		if (genObj.done === true) {
			return;
		}
		
		console.log(genObj.value);
		handler(it.next('Done ' + count++ + ' task' ));
	})(genObj);
}

runIterative(randomgen);
runRecursive(randomgen);