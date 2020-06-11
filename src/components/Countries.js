import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Countries.css'

const Countries = () => {
    const [ countries, setCountries ] = useState([])
    const [ errors, setErrors ] = useState(null)
    const [ newCountry, setNewCountry ] = useState('')

    useEffect(() => {
        axios.get("https://restcountries.eu/rest/v2/all")
            .then(res => setCountries(res.data))
            .catch(err => setErrors(err))
    }, [])

    const handleInputChange = (e) => {
        setNewCountry(e.target.value)
    }
    
    return (
        <div className="countries">
            <h1>Countries</h1>
            <div>
                Find countries <input onChange={ handleInputChange } />
            </div>
            <div>
                <ul>
                    { newCountry && !errors ? <Result countries={countries} newCountry={newCountry} /> : null }
                </ul>
            </div>
        </div>
    )
}

const Result = ({ countries, newCountry }) => {

    const filteredCountries = countries.filter(item => {
        let re = new RegExp(`^${newCountry}`, 'i')
        return re.test(item.name)
    })

    const toggleInfo = (e) => {
        e.target.nextSibling.classList.toggle('active')
    }

    const mappedCountries = filteredCountries
        .map(item => <li key={ item.numericCode }>
                { item.name } <button className="show-btn" onClick={ toggleInfo }>Show</button>
                <Country country={ item } />
            </li>)

    if (mappedCountries.length === 0) return <span>No matches, specify another filter.</span>
    if (mappedCountries.length > 10) return <span>Too many matches, specify another filter.</span>
    if (mappedCountries.length > 1) return mappedCountries

    const country = filteredCountries[0]
    const active = true

    return <Country country={ country } active={ active } />
}

const Country = ({ country, active }) => {

    const languages = country.languages.map(item => <li key={ item.nativeName }>{ item.name }</li>)
    return (
        <div className={ active ? 'country-info active' : 'country-info' }>
            <h2>{ country.name }</h2>
            <p>Capital: { country.capital }</p>
            <p>Population: { country.population } habitants</p>
            <h3>Languages</h3>
            <ul>
                { languages }
            </ul>
            <br/>
            <img src={ country.flag } alt={ country.name } width="200"/>

            <Weather city={ country.capital } />
        </div>
    )
}

const Weather = ({ city }) => {

    const [weather, setWeather] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getWeather = () => {
            const apiKey = process.env.REACT_APP_WEATHER_API_KEY
            axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
                .then(res => {
                    console.log(res.data)
                    setWeather(res.data)
                })
                .catch(err => setError(err))
        }
        getWeather()
    }, [city])

    return weather && !error
        ? (<div className="weather">
                <h3>Weather in { city }</h3>
                <p><strong>Temperature:</strong> { weather.main.temp }º { weather.weather[0].description }</p>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={ weather.weather[0].description }/>
                <p><strong>Wind:</strong> { weather.wind.speed } mph { weather.wind.deg } deg</p>
            </div>)
        : <p>Cannot retrieve weather data.</p>
}

export default Countries