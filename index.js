require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

//blabla
app.use(express.json())
app.use(express.static('dist'))
app.use(errorHandler)



  app.get('/info', async (request, response, next) => {
    const date = new Date();
      try {
          const count = await Person.countDocuments({});
          response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
      } catch (err) {
          next(err);
      }
    });

  app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(people => {
      if (people) {
        response.json(people)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })

  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
  
    Person.findOne({ name: body.name })
      .then(existingPerson => {
        if (existingPerson) {
          Person.findByIdAndUpdate(existingPerson._id, { number: body.number }, { new: true })
            .then(updatedPerson => {
              response.json(updatedPerson)
            })
            .catch(error => next(error))
        } else {
          const person = new Person({
            name: body.name,
            number: body.number,
          })
  
          person.save()
            .then(savedPerson => {
              response.json(savedPerson)
            })
            .catch(error => next(error))
        }
      })
      .catch(error => next(error))
  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })