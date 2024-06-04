import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Nav, Navbar, Carousel, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const apiKey = "fa487829a1dff8fe3207aabd5211cba0";
  const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch(popularMoviesUrl);
      const data = await response.json();
      setMovies(data.results);
      setFilteredMovies(data.results);
    };
    fetchMovies();
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = movies.filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredMovies(filtered);
  };

  const fetchTrailerUrl = async (movieId) => {
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
    const response = await fetch(trailerUrl);
    const data = await response.json();
    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  };

  const handleCardClick = async (movieId) => {
    const trailerUrl = await fetchTrailerUrl(movieId);
    if (trailerUrl) {
      const width = 600;
      const height = 400;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      window.open(trailerUrl, 'Trailer', `width=${width},height=${height},left=${left},top=${top}`);
    } else {
      alert("Trailer not available");
    }
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">NETFLIX</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/tvshow">TV Show</Nav.Link>
              <Nav.Link as={Link} to="/people">People</Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-success" type="submit">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
        {movies.map((movie, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
              alt={movie.title}
              style={{ height: '700px' }}
            />
            <Carousel.Caption>
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container>
        <Row className="movie-cards">
          {filteredMovies.map((movie) => (
            <Col xs={12} md={6} lg={4} key={movie.id} className="mb-4">
              <Card style={{ width: '100%' }} onClick={() => handleCardClick(movie.id)}>
                <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                <Card.Body>
                  <Card.Title>{movie.original_title}</Card.Title>
                  <Card.Text>{movie.overview}</Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
