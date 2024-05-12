require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('dist'))



  app.get('/info', async (request, response) => {
    const date = new Date();
      try {
          const count = await Person.countDocuments({});
          response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
      } catch (err) {
          console.error(err);
          response.status(500).json({ error: 'internal server error' });
      }
    });

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
      response.json(people)
    })
  })

  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.deleteOne({ _id: request.params.id })
      .then(result => {
        if (result.deletedCount > 0) {
          response.status(204).end()
        } else {
          response.status(404).json({ error: 'person not found' })
        }
      })
      .catch(error => {
        console.error(error)
        response.status(500).json({ error: 'internal server error' })
      })
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
  })

  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })