// import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { Form } from 'react-bootstrap';

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;

function App() {
  // console.log('key', process.env.REACT_API_KEY);
  // const [keywords, setKeyWords] = useState('');
  const [images, setImages] = useState([]);
  const [totalpage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)
  const [errorMsg, setErrorMsg] = useState('');
  // const [loading, setLoading] = useState(false)

  const searchInput = useRef(null);

  // useEffect(() =)

  // const getImages = useCallback(async () => {
  //   try {
  //     const response = await fetch(`${API_URL}?query=${searchInput.current.value
  //       }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_KEY}`)
  //     const data = await response.json();
  //     console.log(data)
  //     setImages(data.result)
  //   } catch (error) {
  //     console.log(error.message)
  //   }
  // }, [page]);

  const handleSearch = (event) => {
    if (searchInput.current.value) {
      event.preventDefault();
      resetSearch()
      getImages()
    } else {
      setImages([])
    }
    // console.log(searchInput.current.value)
  }

  const getImages = async () => {
    // setLoading(true)
    try {
      if (searchInput.current.value) {
        setErrorMsg('')
        const response = await fetch(`${API_URL}?query=${searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_KEY}`)
        const data = await response.json();
        console.log(data)
        // setLoading(false)
        if (data.results.length === 0) {
          // another request
          setImages(data.results);
          return;
        }
        setImages(data.results)
        setTotalPage(data.total_pages)
      }

    } catch (error) {
      setErrorMsg('Error fetching images. Try again later/ check your network')
      console.log(error.message)
      // setLoading(false)
    }
  }

  // console.log(loading);
  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch()
    getImages()
  }

  const resetSearch = () => {
    setPage(1);
    getImages()
  }

  useEffect(() => {


    getImages()
  }, [page])

  const handleDownload = (API_URL, imageName) => {
    fetch(API_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', imageName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.log(error.message)
      })
  }



  return (
    <div className="container">
      {/* {loading && <div>loading...</div>} */}
      <h1 className='title'>Image Search</h1>
      {errorMsg && <p className='error.msg'>{errorMsg}</p>}
      <div className="search-section">
        <Form onChange={handleSearch}>
          <Form.Control type="search" placeholder="Search Images..."
            className='search-input' ref={searchInput} />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection('nature')}>Nature</div>
        <div onClick={() => handleSelection('birds')}>Birds</div>
        <div onClick={() => handleSelection('cats')}>Cats</div>
        <div onClick={() => handleSelection('laptop')}>Laptop</div>
      </div>

      <div className='images'>

        {images?.map((image) => {
          return (
            <div key={image.id}>
              <img className='image' src={image.urls.small} alt={image.alt_description} key={image.id} />
              <div className='btns'>
                <button className='btn' onClick={() => handleDownload(image.urls.small, image.alt_description)}>Download</button>
              </div>
            </div>
          )
        })}
      </div>
      {
        images.length > 0 && (
          <div className="buttons">
            {
              page > 1 && (
                <button className='btn' onClick={() => setPage(page - 1)}>Previous</button>
              )
            }
            {
              page < totalpage && (
                <button className='btn' onClick={() => setPage(page + 1)}>Next</button>
              )
            }
          </div>
        )
      }

    </div>
  );
}

export default App;
