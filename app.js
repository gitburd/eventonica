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
      // 'Complete a sentence',
      'List all events!',
      'Get event by id',
      'Create event',
      'Update event',
      'Delete event',

      // 'Find one event of a particular type in San Francisco next week',

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
    if (res.action === 'Find one event of a particular type in San Francisco next week') app.searchEventful(continueCallback);

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

const eventQuestions = [{
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
  },
  {
    type: 'input',
    name: 'numberOfEvents',
    message: 'How many events would you like returned?',
    default: '5',
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
      for (let i = 0; i < 1; i++) {
        console.log("===========================================================")
        console.log('title: ', resultEvents[i].title);
        console.log('start_time: ', resultEvents[i].start_time);
        console.log('venue_name: ', resultEvents[i].venue_name);
        console.log('venue_address: ', resultEvents[i].venue_address);

      }
    });

  });

  continueCallback();
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

// app.getAllEvents = (continueCallback) => {
//   http.get('http://localhost:3000/events', (response) => {
//     let rawData = '';
//     response.on('data', (chunk) => {
//       rawData += chunk;
//     });
//     response.on('end', () => {
//       try {
//         const parsedData = JSON.parse(rawData);
//         console.log(parsedData);
//       } catch (e) {
//         console.error(e.message);
//       }

//     })

//     // console.log(response);
//   })
// }





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

// app.getEventById = (continueCallback) => {
//   // let myUrl=''
//   inquirer.prompt(eventIdQuestions).then(id => {

//     let myUrl = 'http://localhost:3000/events/' + id.number;
//     http.get(myUrl, (response) => {
//       let rawData = '';
//       response.on('data', (chunk) => {
//         rawData += chunk;
//       });
//       response.on('end', () => {
//         try {
//           const parsedData = JSON.parse(rawData);
//           console.log(parsedData);
//         } catch (e) {
//           console.error(e.message);
//         }

//       })

//     })

//   });
// }





// app.createEvent = (continueCallback) => {

//   inquirer.prompt(createEventQuestions).then(answers => {
//     let newEvent = {}
//     newEvent.title = answers.title
//     newEvent.type = answers.type
//     newEvent.date = answers.date


//     const postData = JSON.stringify(
//       newEvent
//     );
//     console.log(postData);

//     const options = {
//       hostname: 'localhost',
//       port: 3000,
//       path: '/events',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(postData)
//       }
//     };

//     const req = http.request(options, (res) => {
//       // console.log(`STATUS: ${res.statusCode}`);
//       // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//       console.log('in request now');
//       res.setEncoding('utf8');
//       res.on('data', (chunk) => {
//         console.log(`BODY: ${chunk}`);
//       });
//       res.on('end', () => {
//         // console.log('No more data in response.');
//       });
//     });

//     req.on('error', (e) => {
//       console.error(`problem with request: ${e.message}`);
//     });

//     // write data to request body
//     req.write(postData);
//     req.end();
//     //
//   });
// }




// app.updateEvent = (continueCallback) => {

//   inquirer.prompt(updateEventQuestions).then(answers => {
//     // let myUrl = 'http://localhost:3000/events/'+answers.number;
//     let newEvent = {}
//     newEvent.id = answers.id
//     newEvent.title = answers.title
//     newEvent.type = answers.type
//     newEvent.date = answers.date


//     // const postData = JSON.stringify(
//     //   newEvent
//     // );
//     // console.log(postData);
//     const postData = JSON.stringify(
//       newEvent
//     );
//     console.log(postData);

//     const options = {
//       hostname: 'localhost',
//       port: 3000,
//       path: `http://localhost:3000/events/${answers.id}`,
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(postData)
//       }
//     };

//     const req = http.request(options, (res) => {
//       // console.log(`STATUS: ${res.statusCode}`);
//       // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);


//       console.log('in request now');
//       res.setEncoding('utf8');
//       res.on('data', (chunk) => {

//         // res.title=newEvent.title;
//         // res.type=newEvent.type;
//         // res.date=newEvent.date;

//         // console.log(`BODY: ${chunk}`);
//       });
//       res.on('end', () => {
//         console.log('No more data in response.');
//       });
//     });

//     req.on('error', (e) => {
//       console.error(`problem with request: ${e.message}`);
//     });

//     // write data to request body
//     req.write(postData);
//     req.end();
//     //
//   });
// }



// !!!!! not working!!!
// app.deleteEvent = (continueCallback) => {
//   // let myUrl=''
//   inquirer.prompt(eventIdQuestions).then(id => {

//     let myUrl = 'http://localhost:3000/events/' + id.number;
//     const options = {
//       hostname: 'localhost',
//       port: 3000,
//       path: '/events',
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(postData)
//       }
//     };

//     const req = http.request(options, (res) => {
//       // console.log(`STATUS: ${res.statusCode}`);
//       // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//       console.log('in request now');
//       res.setEncoding('utf8');
//       res.on('data', (chunk) => {
//         console.log(`BODY: ${chunk}`);
//       });
//       res.on('end', () => {
//         // console.log('No more data in response.');
//       });
//     });

//     req.on('error', (e) => {
//       console.error(`problem with request: ${e.message}`);
//     });

//   });
// }







module.exports = app;