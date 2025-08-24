import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Badge, Button, InputGroup, Card } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon   from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { BusFrontFill, ClockFill, ArrowUp, PersonFill, PersonWheelchair } from "react-bootstrap-icons";

const DefaultIcon = L.icon({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  shadowSize:  [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;


function Vehicle({ vehicle }) {
  return (
    <Marker position={[vehicle.lat, vehicle.lon]}>
      <Popup>
        <Card style={{ minWidth: "220px" }} className="shadow-sm">
          <Card.Body>

            <Card.Title>
              <BusFrontFill className="me-2 text-primary"/> Vettura {vehicle.id}
            </Card.Title>

            <Card.Text>
              <PersonWheelchair className="me-2" />
              {vehicle.disabili ? (
                <Badge bg="success">Accessibile</Badge>
              ) : (
                <Badge bg="secondary">Non accessibile</Badge>
              )}
            </Card.Text>

            <Card.Text>
              <ClockFill className="me-2" />
              Aggiornamento: {vehicle.aggiornamento}
            </Card.Text>

            <Card.Text>
              <PersonFill className="me-2" />
              Occupazione: <Badge bg="info">{vehicle.occupazione}</Badge>
            </Card.Text>

            <Card.Text>
              <PersonFill className="me-2" />
              Fermata: <Badge bg="info">{vehicle.fermata_vicina.stopName}</Badge>
            </Card.Text>

          </Card.Body>
        </Card>
      </Popup>
    </Marker>
  );
}


function App() {
  const [number, setNumber]     = useState("");
  const [vehicles, setVehicles] = useState([]);

  // Fetch vehicles once when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!number) return;

    fetch(`/api/lines/${number}`)
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error(err));
  };

  // Once the number is selected, the application must
  // request each second fresh data until a new number
  // is selected
  useEffect(() => {
    if (!number) return;

    const interval = setInterval(() => {
      fetch(`/api/lines/${number}`)
        .then(res => res.json())
        .then(data => setVehicles(data))
        .catch(err => console.error(err));
    }, 2000);
    return () => clearInterval(interval);

  }, [number]);


  return (
    <Container fluid className="p-4 bg-light min-vh-100">


      <Row className="mb-4">
        <Col className="d-flex justify-content-center align-items-center">
          <h1 className="fw-bold text-primary d-flex align-items-center">
            <img 
              src={process.env.PUBLIC_URL + "/Logo_GTT.png"} 
              style={{ width: "100px", height: "50px", marginRight: "10px" }}
            />
          </h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <div className="card shadow-sm p-3">
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Form.Control type="string" placeholder="Inserisci linea..." value={number} onChange={(e) => setNumber(e.target.value)}/>
                <Button variant="primary" type="submit">
                  Cerca
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={10} className="mx-auto">
          <div className="card shadow-lg">
            <MapContainer center={[45.0703, 7.6869]} zoom={13} style={{ height: "600px", width: "100%" }} >
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              {vehicles.map((v) => ( <Vehicle key={v.id} vehicle={v} /> ))}
            </MapContainer>
          </div>
        </Col>
      </Row>

      {/* Footer */}
      <Row className="mt-4">
        <Col className="text-center text-muted">
          <small>
            Segui GTT – tracking realtime of public transport | &copy; {2025} | v1.0
          </small>
        </Col>
      </Row>

    </Container>
  );
}

export default App;
