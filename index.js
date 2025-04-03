const express = require('express');
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
// Create a custom token for logging request body
morgan.token('req-body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '-'
  });
  
  // Configure morgan with custom format
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = 
    [
        { 
          "id": "1",
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": "2",
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": "3",
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": "4",
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        }
    ]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.random(...persons.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}


app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).send("Person ID could not be found.").end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'name or number missing' 
        })
    }

    const personExists = persons.some(person => person.name === body.name)
    if (personExists) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const newPerson = {
        id: String(persons.length + 1),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
    morgan('tiny')
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`Phonebook has info for ${persons.length} people <br> ${date}`)
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});