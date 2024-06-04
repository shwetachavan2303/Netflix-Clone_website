import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Nav, Navbar, Carousel, Card, Row, Col } from 'react-bootstrap';
import './Tvshow.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

const Tvshow = () => {
  const apiKey = "fa487829a1dff8fe3207aabd5211cba0";
  const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;

  const [popular, setPopular] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPopular = async () => {
      const data = await fetch(url);
      const tvshows = await data.json();
      setPopular(tvshows.results);
      setQuery(tvshows.results);
    };
    fetchPopular();
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = popular.filter(tvshow => tvshow.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setQuery(filtered);
  };

  const fetchTrailerUrl = async (tvshowId) => {
    const trailerUrl = `https://api.themoviedb.org/3/tv/${tvshowId}/videos?api_key=${apiKey}&language=en-US`;
    const response = await fetch(trailerUrl);
    const data = await response.json();
    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  };

  const handleCardClick = async (tvshowId) => {
    const trailerUrl = await fetchTrailerUrl(tvshowId);
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
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link href="/">Home</Nav.Link>
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
              <Button variant="outline-success" type='submit'>Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Carousel activeIndex={activeIndex} onSelect={handleSelect}>
        {popular.map((tvshow, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={`https://image.tmdb.org/t/p/w500/${tvshow.backdrop_path}`}
              alt={tvshow.name}
              style={{ height: '700px' }}
            />
            <Carousel.Caption>
              <h3>{tvshow.name}</h3>
              <p>{tvshow.overview}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container>
        <Row>
          {query.map((tvshow) => (
            <Col xs={12} md={6} lg={4} key={tvshow.id} className="mb-4">
              <Card style={{ width: '100%' }} onClick={() => handleCardClick(tvshow.id)}>
                <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500/${tvshow.poster_path}`} />
                <Card.Body>
                  <Card.Title>{tvshow.name}</Card.Title>
                  <Card.Text>{tvshow.overview}</Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Tvshow;
