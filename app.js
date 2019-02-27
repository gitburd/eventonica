const inquirer = require('inquirer');
//connection available to all
const connection = require('./connection');

const eventfulKey = require("./keys.js").eventful;
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);
const request = require('request-promise')

const app = {};

app.startQuestion = (closeConnectionCallback) => {
  inquirer.prompt({
    type: 'list',
    message: 'What action would you like to do?',
    choices: [
      'Complete a sentence',
      'Create a new user',
      'Find one event of a particular type in San Francisco next week',
      'Mark an existing user to attend an event in database',
      'See all events that a particular user is going to',
      'See all the users that are going to a particular event',
      'Exit'
    ],
    name:'action',
  }).then((res) => {
    const continueCallback = () => app.startQuestion(closeConnectionCallback);

    if (res.action === 'Complete a sentence') app.completeSentence(continueCallback);
    if (res.action === 'Create a new user') app.createNewUser(continueCallback);
    if (res.action === 'Find one event of a particular type in San Francisco next week') app.searchEventful(continueCallback);
    if (res.action === 'Mark an existing user to attend an event in database') app.matchUserWithEvent(continueCallback);
    if (res.action === 'See all events that a particular user is going to') app.seeEventsOfOneUser(continueCallback);
    if (res.action === 'See all the users that are going to a particular event') app.seeUsersOfOneEvent(continueCallback);
    if (res.action === 'Exit') {
      closeConnectionCallback();
      return;
    }
  })
}

const questions =
[
  {
  type: 'input',
  name: 'flavor',
  message: 'what is your favorite flavor?',
  default : 'strawberries'
},
{
  type: 'input',
  name: 'animal',
  message: 'what is your favorite animal?',
  default : 'cat'
}
];

app.completeSentence = (continueCallback) => {
  
  inquirer.prompt(questions).then(answers => {
  //  console.log(console.log('\nAnswers.animal'));
  //  console.log(JSON.stringify(answers, null, ' -- '));
      console.log('I once knew a ' + answers.animal +' that smelled like ' +answers.flavor);
});

  continueCallback();
}

app.createNewUser = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();

}

const eventQuestions =
[
  {
  type: 'input',
  name: 'type',
  message: 'what type of event are you looking for?',
  default : 'dance'
},
{
  type: 'input',
  name: 'location',
  message: 'Where would you like the even to tak place?',
  default : 'San Francisco'
}, 
{
  type: 'input',
  name: 'numberOfEvents',
  message: 'How many events would you like returned?',
  default : '5',
}
];


app.searchEventful = (continueCallback) => {
  
  inquirer.prompt(eventQuestions).then(event => {
      console.log('I want to ' + event.type +' in ' + event.location);
      client.searchEvents({
        keywords: event.type,
        location: event.location,
        date: "Next Week",
        
      }, function(err, data){
         if(err){
           return console.error(err);
         }
        //  Number(answers.numOfEvents)
         
         let resultEvents = data.search.events.event;
         console.log('Received ' + data.search.total_items + ' events');
         console.log('Event listings: ');
         for ( let i =0 ; i <1; i++){
           console.log("===========================================================")
           console.log('title: ',resultEvents[i].title);
           console.log('start_time: ',resultEvents[i].start_time);
           console.log('venue_name: ',resultEvents[i].venue_name);
           console.log('venue_address: ',resultEvents[i].venue_address);
         
        }
      });
  
  });

  continueCallback();
}

app.matchUserWithEvent = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

app.seeEventsOfOneUser = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

app.seeUsersOfOneEvent = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

module.exports = app;
