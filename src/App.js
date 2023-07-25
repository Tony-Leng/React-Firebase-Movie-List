import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db } from './config/firebase';
import { getDocs, collection } from 'firebase/firestore';

function App() {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    // async function inside useEffect needs to have a function defined
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id,}));
        setMovieList(filteredData);
      } catch (error) {
        console.error(error);
      }
    }

    getMovieList();
  }, [])
    ;

  return (
    <div className="App">
      <h1>Movie List</h1>
      <Auth />

      <div>
        {movieList.map((movie) => (
          <div>
            <h1> {movie.title} </h1>
            <p>Date: {movie.releaseDate} </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
