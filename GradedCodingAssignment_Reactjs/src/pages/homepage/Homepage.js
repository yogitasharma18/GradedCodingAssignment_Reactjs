import React, { useEffect, useState } from "react";
import { Row, Col, Menu } from "antd";
import "./homepage.css";
import MovieList from "../../components/MovieList";
import MovieListHeading from "../../components/MovieListHeading";
import AddFavourites from "../../components/AddFavourites";
import RemoveFavourites from "../../components/RemoveFavourites";
import Search from "antd/lib/input/Search";
import { openNotification } from "../../components/OpenNotification";
import {
  addToFavMovie,
  getAllMovie,
  getFavouriteMovies,
  getMovieSearch,
  removeFromFavourite,
} from "../../service/movie";

const Homepage = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const getMovies = async (data) => {
    setLoading(true);
    await getAllMovie(data)
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getMovies("movies-in-theaters");
  }, []);
  const getMovieRequest = async (searchValue) => {
    await getMovieSearch(current, searchValue)
      .then(async (res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getFavMovies = async (data) => {
    setLoading(true);
    await getFavouriteMovies()
      .then((res) => {
        setFavourites(res.data);
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addFavouriteMovie = async (movie) => {
    const checkfavourite = favourites.find(
      (favourite) => favourite.id === movie.id
    );
    if (checkfavourite === undefined) {
      const newFavouriteList = [...favourites, movie];
      await addToFavMovie(movie)
        .then((res) => {
          openNotification("Succeffully added to favourite", "success");
        })
        .catch((err) => {});

      setFavourites(newFavouriteList);
    } else {
      openNotification("Already added in favourite", "error");
    }
  };

  const removeFavouriteMovie = async (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.id !== movie.id
    );
    const id = movie.id.toString();
    setLoading(true);
    await removeFromFavourite(id)
      .then((res) => {
        openNotification("Succeffully removed from favourite", "success");
        setLoading(false);
        getFavMovies();
      })
      .catch((err) => {});
    setFavourites(newFavouriteList);
  };
  const [current, setCurrent] = useState("movies-in-theaters");
  const handleClick = (e) => {
    setCurrent(e.key);
    setSearchValue("");
    e.key === "favourite" ? getFavMovies(e.key) : getMovies(e.key);
  };
  const [loading, setLoading] = useState(false);
  const onSearch = (e) => {
    setLoading(true);
    getMovieRequest(e.target.value);
    setSearchValue(e.target.value);
  };
  return (
    <>
      <Row className="border-bottom">
        <Col span={20}>
          <Menu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal"
          >
            <Menu.Item key="movies-in-theaters">Movies in theaters</Menu.Item>
            <Menu.Item key="movies-coming">Coming soon</Menu.Item>
            <Menu.Item key="top-rated-india">Top rated Indian</Menu.Item>
            <Menu.Item key="top-rated-movies">Top rated movies</Menu.Item>
            <Menu.Item key="favourite">Favourites</Menu.Item>
          </Menu>
        </Col>
        <Col span={4}>
          <Search
            size="large"
            placeholder="Search movie"
            onChange={onSearch}
            enterButton
            style={{ minWidth: "200px", marginTop: "5px" }}
            loading={loading}
            name="search"
            value={searchValue || ""}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <MovieListHeading
          heading={current === "favourite" ? "Favourites" : "Movies"}
        />
      </Row>

      <MovieList
        loading={loading}
        current={current}
        movies={movies}
        handleFavouritesClick={
          current === "favourite" ? removeFavouriteMovie : addFavouriteMovie
        }
        favouriteComponent={
          current === "favourite" ? RemoveFavourites : AddFavourites
        }
      />

      {/* <Row>
        <MovieListHeading heading="Favourites" />
      </Row>

      <MovieList
        loading={loading}
        current={current}
        movies={favourites}
        handleFavouritesClick={removeFavouriteMovie}
        favouriteComponent={RemoveFavourites}
      /> */}
    </>
  );
};

export default Homepage;
