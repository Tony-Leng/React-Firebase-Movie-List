import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/auth';
import { db } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newGenre, setNewGenre] = useState("");

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        genre: newGenre
      });
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Movie List</h1>
      <Auth />

      <div>
        <input
          placeholder='Movie title...'
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder='Release Date...'
          type='number'
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          placeholder='genre...'
          onChange={(e) => setNewGenre(e.target.value)}
        />
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>

      <div>
        {movieList.map((movie) => (
          <div>
            <h1> {movie.title} </h1>
            <p>Date: {movie.releaseDate} </p>
            <p>Genre: {movie.genre} </p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
