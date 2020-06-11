import React, { useState, useEffect } from 'react'
import pbService from '../services/phonebook'

const Phonebook = () => {
  useEffect(() => {
    pbService
      .getAll()
      .then(data => {
        setPersons(data)
        setIsLoading(false)
      })
      .catch(err => {
        displayDialog('There was an error retrieving phonebook data.')
        setIsLoading(false)
      })
  }, [])

  /*State*/
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearchTerm, setSearchTerm ] = useState('')
  const [ isLoading, setIsLoading ] = useState(true)
  const [ error, setError ] = useState(null)

  /*Methods*/
  const handleSubmit = (e) => {
    e.preventDefault()

    let newNameObject = {
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }

    if (persons.some(item => item.name.toLowerCase() === newName.toLowerCase())) {
      const question = window.confirm(`${newName} is already added to the Phonebook. Update phone number with the newer one?`)
      if (!question) return

      const target = persons.find(item => item.name === newName)
      pbService
        .update(target.id, {...target, number: newNumber})
        .then(data => {
          console.log(data)
          setPersons(persons.map(item => item.name === newName
            ? {...item, number: newNumber}
            : item))
          setIsLoading(false)
        })
        .catch(() => {
          displayDialog('There was an error updating the record.')
          setIsLoading(false)
        })
      
      document.querySelector('#name_input').value = ''
      document.querySelector('#number_input').value = ''
      return
    }

    pbService
      .create(newNameObject)
      .then(() => {
        setPersons([...persons, newNameObject])
        setIsLoading(false)
      })
      .catch(err => {
        displayDialog('There was an error creating a new record.')
        setIsLoading(false)
      })

    document.querySelector('#name_input').value = ''
    document.querySelector('#number_input').value = ''
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleNameInputChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberInputChange = (e) => {
    setNewNumber(e.target.value)
  }

  const displayDialog = (msg) => {
    setError(msg)

    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter
        persons={ persons } //State
        newSearchTerm={ newSearchTerm } //State
        handleSearchChange={ handleSearchChange } //Callback
      />
      <h2>Add New</h2>
      <PersonForm
        handleSubmit={ handleSubmit }
        handleNameInputChange={ handleNameInputChange }
        handleNumberInputChange={ handleNumberInputChange }
      />
      <h2>Numbers</h2>
      <Notification message={ error } />
      { isLoading ? <h3>Loading...</h3> : null }
      { persons
        ? <Persons
            persons={ persons }
            updatePersons={ (newPersons) => setPersons(newPersons) }
            displayDialog={ displayDialog } />
        : <p>Cannot reach phonebook.</p> }
    </div>
  )
}

const Notification = ({ message }) => {
  if (!message) return null

  const notificationStyle = {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%)',
    boxShadow: '2px 2px 4px #7f8c8d',
    border: '1px solid #e74c3c',
    borderRadius: 5,
    color: '#e74c3c',
    padding: 20,
    margin: 15
  }

  return (
    <div className="error" style={ notificationStyle }>
      { message }
    </div>
  )
}
  
const Filter = ({ persons, newSearchTerm, handleSearchChange }) => {

    const filterNames = persons
        .filter(item => {
        let re = new RegExp(newSearchTerm, 'i')
        return re.test(item.name)
        })
        .map(item => <li key={ item.id }>{ item.name } { item.number }</li>)

    return (
        <div className="filter">
        <div className="search">
            Filter shown with <input id="search_input" onChange={ handleSearchChange } />
            <ul>{ newSearchTerm ? filterNames : null }</ul>
        </div>
        </div>
    )
}

const PersonForm = ({ handleSubmit, handleNameInputChange, handleNumberInputChange }) => {
    return (
        <div className="person-form">
        <form onSubmit={ handleSubmit }>
            <div>
                name: <input id="name_input" onChange={ handleNameInputChange } />
            </div>
            <div>
                number: <input id="number_input" onChange={ handleNumberInputChange } />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
        </div>
    )
}

const Persons = ({ persons, updatePersons, displayDialog }) => {
  return (
    <div className="persons">
        <table>
          <tbody>
            {
              persons
                .map(person =>
                  <Person
                    key={ person.id }
                    person={person}
                    updatePersons={ updatePersons }
                    persons={persons}
                    displayDialog={displayDialog} />)
            }
          </tbody>
        </table>
    </div>
  )
}

const Person = ({ person, persons, updatePersons, displayDialog }) => {
  const handleDelete = () => {
    const question = window.confirm(`Are you sure you want to delete ${person.name}?`)
    if (!question) return

    pbService
      .remove(person.id)
      .then(data => {
        console.log(data)
        updatePersons(persons.filter(item => item.id !== person.id))
      })
      .catch(() => displayDialog('There was an error trying to delete record. Please refresh browser and try again.'))
  }
  return (
    <tr>
      <td>{ person.name }</td>
      <td>{ person.number }</td>
      <td><button onClick={ handleDelete }>delete</button></td>
    </tr>
  )
}

export default Phonebook