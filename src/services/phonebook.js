import axios from 'axios'

const url = 'https://phonebook-api-server.herokuapp.com/api/persons'

const getAll = () => {
    const request = axios.get(url)
    return request.then(res => res.data)
}

const create = (newObject) => {
    const request = axios.post(url, newObject)
    return request.then(res => res.data)
}

const remove = (id) => {
    const request = axios.delete(`${url}/${id}`)
    return request.then(res => res.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${url}/${id}`, newObject)
    return request.then(res => res.data)
}

export default { getAll, create, remove, update }