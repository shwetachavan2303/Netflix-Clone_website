import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Nav, Navbar, Card, Row, Col, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './People.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

const People = () => {
  const url = "https://api.themoviedb.org/3/trending/person/day?api_key=fa487829a1dff8fe3207aabd5211cba0&language=en-US";

  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.json();
      setPeople(data.results);
      setFilteredPeople(data.results); 
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = people.filter(person => 
      person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPeople(filtered);
  };

  const handleCardClick = (person) => {
    setSelectedPerson(person);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPerson(null);
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
      
      <Container>
        <Row>
          {filteredPeople.map((person) => (
            <Col xs={12} md={6} lg={4} key={person.id} className="mb-4">
              <Card style={{ width: '100%' }} onClick={() => handleCardClick(person)}>
                <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`} />
                <Card.Body>
                  <Card.Title>{person.name}</Card.Title>
                  <Card.Text>{person.media_type}</Card.Text>
                  <Button variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPerson && selectedPerson.name}'s Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPerson && (
            <div>
              <p><strong>Name:</strong> {selectedPerson.name}</p>
              <p><strong>Birthdate:</strong> {selectedPerson.birthday}</p>
              <p><strong>Recent Movie:</strong> {selectedPerson.recent_movie}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default People;
