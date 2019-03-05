const http = require('http');
const inquirer = require('inquirer');
//connection available to all
// const connection = require('./connection');

const eventfulKey = require("./keys.js").eventful;
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);
const fetch = require('node-fetch');



const app = {};


// app.use(node-fetch());

app.startQuestion = (closeConnectionCallback) => {
  inquirer.prompt({
    type: 'list',
    message: 'What action would you like to do?',
    choices: [
      'Complete a sentence',
      'List all events!',
      'Get event by id',
      'Create event',
      'Update event',
      'Delete event',
      'Get one eventful event',
      'Exit'
    ],
    name: 'action',
  }).then((res) => {
    const continueCallback = () => app.startQuestion(closeConnectionCallback);

    if (res.action === 'Complete a sentence') app.completeSentence(continueCallback);
    if (res.action === 'List all events!') app.getAllEvents(continueCallback);
    if (res.action === 'Get event by id') app.getEventById(continueCallback);
    if (res.action === 'Create event') app.createEvent(continueCallback);
    if (res.action === 'Update event') app.updateEvent(continueCallback);
    if (res.action === 'Delete event') app.deleteEvent(continueCallback);
    if (res.action === 'Get one eventful event') app.searchEventful(continueCallback);

    if (res.action === 'Exit') {
      closeConnectionCallback();
      return;
    }
  })
}

const questions = [{
    type: 'input',
    name: 'flavor',
    message: 'what is your favorite flavor?',
    default: 'strawberries'
  },
  {
    type: 'input',
    name: 'animal',
    message: 'what is your favorite animal?',
    default: 'cat'
  }
];

app.completeSentence = (continueCallback) => {

  inquirer.prompt(questions).then(answers => {
    //  console.log(console.log('\nAnswers.animal'));
    //  console.log(JSON.stringify(answers, null, ' -- '));
    console.log('I once knew a ' + answers.animal + ' that smelled like ' + answers.flavor);
  });

  // continueCallback();
}

const eventQuestions = [
  {
    type: 'input',
    name: 'type',
    message: 'what type of event are you looking for?',
    default: 'dance'
  },
  {
    type: 'input',
    name: 'location',
    message: 'Where would you like the even to tak place?',
    default: 'San Francisco'
  }

];


app.searchEventful = (continueCallback) => {

  inquirer.prompt(eventQuestions).then(event => {
    console.log('I want to ' + event.type + ' in ' + event.location);
    client.searchEvents({
      keywords: event.type,
      location: event.location,
      date: "Next Week",

    }, function (err, data) {
      if (err) {
        return console.error(err);
      }
      //  Number(answers.numOfEvents)

      let resultEvents = data.search.events.event;
      console.log('Received ' + data.search.total_items + ' events');
      console.log('Event listings: ');

  const body = { 
    title:`${resultEvents[0].title}`,
    type:`${event.type}`,
    date:`${resultEvents[0].start_time}`
  }
  console.log(body, JSON.stringify(body))
  fetch("http://localhost:3000/events", {
          method: 'post',
          body:    JSON.stringify(body),
          headers: { 'Content-Type': 'application/json'}
      })
    .catch(function(e) {console.log(e)})
    })

  })
}




app.getAllEvents = (continueCallback) => {
  
  fetch("http://localhost:3000/events").then(res => res.json()).then(json => console.log(json)).catch(function(e) {
    console.log(e); // “oh, no!”
   })

}

app.getEventById = (continueCallback) => {
  
  inquirer.prompt(eventIdQuestions).then(event => {
    
fetch(`http://localhost:3000/events/${event.id}`).then(res => res.json()).then(json => console.log(json)).catch(function(e) {
  console.log(e); // “oh, no!”
 })
  })
}


app.createEvent = (continueCallback) => {

  inquirer.prompt(createEventQuestions).then(answers => {
    const body = { 
      title:`${answers.title}`,
      type:`${answers.type}`,
      date:`${answers.date}`
       }
      console.log(body, JSON.stringify(body))
fetch("http://localhost:3000/events", {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json'}
    })
  .catch(function(e) {console.log(e)})
  })
}

app.updateEvent = (continueCallback) => {

  inquirer.prompt(updateEventQuestions).then(answers => {
    const id = answers.id;
    const body = { 
      title:`${answers.title}`,
      type:`${answers.type}`,
      date:`${answers.date}`
       }
       fetch(`http://localhost:3000/events/${id}`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json'}
    })
  .catch(function(e) {console.log(e)})
  })
}

app.deleteEvent = (continueCallback) => {

  inquirer.prompt(eventIdQuestions).then(answers => {
    const id = answers.id;
       fetch(`http://localhost:3000/events/${id}`, {
        method: 'delete',
        // body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json'}
    })
  .then(function(ducks) {console.log("it worked!")})

  .catch(function(e) {console.log(e)})
  })
}

const eventIdQuestions = [{
  type: 'input',
  name: 'id',
  message: 'which event do you want?',
  default: '1'
}]

const createEventQuestions = [{
  type: 'input',
  name: 'title',
  message: 'What do you want to call your event?',
  default: 'coffee time!'
},
{
  type: 'input',
  name: 'type',
  message: 'What kind of event is this?',
  default: 'coffee. it is coffee time!'
},
{
  type: 'input',
  name: 'date',
  message: 'When is your event?',
  default: '02172019'
},

]

const updateEventQuestions = [{
  type: 'input',
  name: 'id',
  message: 'Which do you want to change?',
  default: '1'
},
{
  type: 'input',
  name: 'title',
  message: 'What do you want to call your event?',
  default: 'coffee time!'
},
{
  type: 'input',
  name: 'type',
  message: 'What kind of event is this?',
  default: 'coffee!'
},
{
  type: 'input',
  name: 'date',
  message: 'When is your event?',
  default: '02172019'
},

]

// THE END

module.exports = app;