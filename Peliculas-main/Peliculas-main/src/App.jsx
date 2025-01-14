import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { Searcher } from './components/Search';
import { CardList } from './components/CardList';
import { MovieDetails } from './components/MovieDetails';
import { Header } from './components/Header';
import { Inicio } from './components/Inicio';
import { VerMasTarde } from './components/VerMasTarde';
import { MdErrorOutline } from "react-icons/md";

function App() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const API_KEY = 'a4b0eb1d';
  const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`;
  const location = useLocation();
  const navigate = useNavigate();
  const [errorSearch, setErrorSearch] = useState(false);

  const changeSearch = (value) => {
    setSearch(value);
    setIsSearching(true);
    navigate('/search');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.Search) {
          const filteredData = result.Search.filter(
            (item) => item.Type === 'movie' || item.Type === 'series'
          );
          setData(filteredData);
          setErrorSearch(false);
        } else {
          setData([]);          
          setErrorSearch(true);
        }
      } catch (error) {
        console.log('Error Message: ' + error);
      } finally {
        setIsSearching(false);
      }
    };

    if (search && location.pathname === '/search') {
      fetchData();
    }
  }, [search, location.pathname]);

  useEffect(() => {
    if (location.pathname === '/') {
      setSearch('');
      setData(null);
      setIsSearching(false);
    }
  }, [location.pathname]);

  const isMovieDetails = matchPath('/movie/:id', location.pathname);
  const isVerMas = matchPath('/ver-mas-tarde', location.pathname);

  return (
    <>
      <Header />
      {!isMovieDetails && !isVerMas && (
        <>
        <Searcher search={search} changeSearch={changeSearch} />
        {errorSearch === true && search != '' &&(
          <div className='errorSearch'>
            <MdErrorOutline />
            <p > La pelicula que buscaste no existe.</p>
          </div>
        )}
        <div className='barra1'></div>
        <div className='barra2'></div>
        </>
      )}


      <Routes>
        {!isSearching && <Route path="/" element={<Inicio />} />}
        <Route path="/search" element={<CardList data={data} />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/ver-mas-tarde" element={<VerMasTarde />} />
      </Routes>
    </>
  );
}

export default App;
