import React, { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
import './App.css'

// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {


  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const mounted = useRef(false)
  const [newImages, setNewImages] = useState(false)

  const fetchImages = async () => {
    setLoading(true)
    let url;
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`

    if (query) {
      url = `${searchUrl}?client_id=f0LEEdZzisebRu87ChvCWYx4nGI_XCwaWbx6YYTFSYQ${urlPage}${urlQuery}`
//       url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    } else {
      url = `${mainUrl}?client_id=f0LEEdZzisebRu87ChvCWYx4nGI_XCwaWbx6YYTFSYQ${urlPage}`
//       url = `${mainUrl}${clientID}${urlPage}`
    }


    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results
        }
        else if (query) {
          // console.log(data.results)
          // console.log(page)
          return [...oldPhotos, ...data.results]
        } else {
          return [...oldPhotos, ...data]
        }
      })
      setNewImages(false)
      setLoading(false)
    } catch (error) {
      setNewImages(false);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchImages();
  }, [page])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return;
    }
    if (!newImages) return
    if (loading) return
    setPage((oldPage) => oldPage + 1)
  }, [newImages])

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', event)
    return () => window.removeEventListener('scroll', event)
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchImages();
      return;
    }
    setPage(1)
  }

  return <main>
    <section className='search'>
      <form className='search-form'>
        <input
          type='text'
          placeholder='search'
          className='form-input'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type='submit' className='submit-btn' onClick={handleSubmit}>
          <FaSearch />
        </button>
      </form>
    </section>
    <section className='photos'>
      <div className='photos-center'>
        {photos.map((image, index) => {
          return <Photo key={index} {...image} />
        })}
      </div>
      {loading && <h2 className='loading'>loading...</h2>}
    </section>
  </main>
}

export default App
