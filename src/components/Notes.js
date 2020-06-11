import React, { useEffect, useState } from 'react'
import noteService from '../services/notes'

const Something = () => {

    const [ notes, setNotes ] = useState([])
    const [ newNote, setNewNote ] = useState('')
    const [ newImportant, setNewImportant ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ errors, setErrors ] = useState()

    useEffect(() => {
        noteService
            .getAll()
            .then(data => {
                console.log(data)
                setNotes(data)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
                setErrors(err)
                setIsLoading(false)
            })
    }, [])

    const addNote = event => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            date: new Date(),
            important: newImportant,
            id: notes.length + 1
        }
      
        noteService
            .create(noteObject)
            .then(data => {
                console.log(data)
                setNotes(notes.concat(data))
                setNewNote('')
                setNewImportant(false)
          })
    }

    const notesList = notes.map(item => <li key={ item.id }>{ item.date } - { item.content }</li>)

    return (
        <div className="something">
            <h1>Add note</h1>
            <form onSubmit={ addNote }>
                <div>
                    Content <input type="text" onChange={ (e) => setNewNote(e.target.value) } value={ newNote }/>
                </div>
                <div>
                    Important <select onChange={ (e) => setNewImportant(e.target.value) }>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>
                <input type="submit" value="Save"/>
            </form>
            <h1>Notes</h1>
            { isLoading ? <h3>Loading...</h3> : null }
            <ul>
                { notes && !errors ? notesList : <li>No notes have been found.</li> }
            </ul>
        </div>
    )
}

export default Something