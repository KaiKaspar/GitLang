import React, { useState } from 'react'
import { Input, Image } from 'semantic-ui-react'
import Typist from 'react-typist'
import axios from 'axios'

const Search = () => {
    const [search, setSearch] = useState('')
    const [favourite, setFavourite] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)

    const gifs = ["https://i2.wp.com/flomu.net/blog/wp-content/uploads/2018/03/coder.gif?resize=450%2C258", 
    "https://media.giphy.com/media/QHE5gWI0QjqF2/giphy.gif", 
    "https://s0.rbk.ru/v6_top_pics/resized/1440xH/media/img/4/11/755066864488114.gif",
    "https://media1.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
    "https://thumbs.gfycat.com/KnobbyJoyfulDeermouse-size_restricted.gif"
]

    function getFavourite(languages){
        var countedLanguages = []
        countedLanguages = languages.reduce(function (allLanguages, language) { 
            if (language in allLanguages) {
                allLanguages[language]++;
            }
            else {
                allLanguages[language] = 1;
            }
            return allLanguages;
            }, {})
            var keysSorted = Object.keys(countedLanguages).sort(function(a,b){return countedLanguages[a]-countedLanguages[b]})
            if(keysSorted.length > 0){
            return setFavourite(keysSorted[keysSorted.length - 1])
            } else {
                setError('does not have a favourite language')
            }
    }

    function handleSubmit(username) {
        var languages = {}
            axios.get(`https://api.github.com/users/${username}/repos?per_page=50&sort=created`)
            .then(function (response) {
                    languages = response.data.map(r => r.language)
                    languages = languages.filter(l => l !== null)
                    getFavourite(languages)
                })
                .catch(error => {
                    setError('could not be found')
                })
        }
    return (
        <div>
            <form style={{padding: "1rem"}} className="form" onSubmit={e => {
                    e.preventDefault()
                    setError(null)
                    handleSubmit(search)
                    setUsername(search)
                    setSearch("")
                    setFavourite("")
                }}>
                    <Input icon='search' placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)}/>
                </form>
                {favourite && search === '' ? <div><Typist><h1>{username}'s favourite language is <strong>{favourite}</strong></h1></Typist><Image src={gifs[Math.floor(Math.random()*gifs.length)]} size='large' wrapped /></div> : <h3>Search a Github Username to see their favourite coding language!</h3>} 
                {error && search === '' ? <div><h1>{username} {error}</h1><Image src='https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif' size='medium' wrapped /><Typist><h1>{("Error! ").repeat(100)}</h1></Typist></div> : null}
        </div>
    )
}

export default Search