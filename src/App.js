import React, { useState } from 'react';
import hogData from './Pocker_data';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Modal, Button } from 'react-bootstrap';
import Nav from "./Nav"; // Navigation component

// Component to display each hog item
function HogDisplay({ hogList, onHogClick, activeHog, toggleHogVisibility }) {
  const [greaseFilter, setGreaseFilter] = useState(false);
  const [sortType, setSortType] = useState('');

  // Toggle filter to show only greased hogs
  const toggleGreaseFilter = () => {
    setGreaseFilter(!greaseFilter);
  };

  // Update sorting option based on user selection
  const handleSortSelection = (event) => {
    setSortType(event.target.value);
  };

  // Apply greased filter and exclude hidden hogs if selected
  const hogsToDisplay = greaseFilter
    ? hogList.filter(hog => hog.greased && !hog.hidden)
    : hogList.filter(hog => !hog.hidden);

  // Sort the filtered hogs list based on chosen sorting option
  const displayedHogs = [...hogsToDisplay].sort((hogA, hogB) => {
    if (sortType === 'name') {
      return hogA.name.localeCompare(hogB.name);
    } else if (sortType === 'weight') {
      return hogA.weight - hogB.weight;
    }
    return 0;
  });

  return (
    <div className="container">
      <div className="mb-3">
        <label>
          <input
            type="checkbox"
            checked={greaseFilter}
            onChange={toggleGreaseFilter}
          />
          Show greased hogs only
        </label>
      </div>

      <div className="mb-3">
        <label>Sort by: </label>
        <select value={sortType} onChange={handleSortSelection}>
          <option value="">Select...</option>
          <option value="name">Name</option>
          <option value="weight">Weight</option>
        </select>
      </div>

      <div className="row row-cols-4">
        {displayedHogs.map((hog, idx) => (
          <div className="col mb-3" key={idx} onClick={() => onHogClick(idx)}>
            <div className="card">
              <img src={hog.image} className="card-img-top" alt={hog.name} />
              <div className="card-body">
                <h3 className="card-title">{hog.name}</h3>
                {activeHog === idx && (
                  <div>
                    <p className="card-text">Specialty: {hog.specialty}</p>
                    <p className="card-text">Greased: {hog.greased ? 'Yes' : 'No'}</p>
                    <p className="card-text">Weight: {hog.weight} kg</p>
                    <p>Top Medal: {hog["highest medal achieved"]}</p>
                  </div>
                )}
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering onHogClick
                    toggleHogVisibility(idx);
                  }}
                >
                  {hog.hidden ? "Show" : "Hide"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main application component
function App() {
  const [hogList, setHogList] = useState(hogData.map(hog => ({ ...hog, hidden: false })));
  const [activeHogIndex, setActiveHogIndex] = useState(null);
  const [hogForm, setHogForm] = useState({
    name: '',
    specialty: '',
    greased: false,
    weight: '',
    "highest medal achieved": '',
    image: '',
    hidden: false // New property for hiding the hog
  });
  const [showModal, setShowModal] = useState(false);

  // Toggle the active hog to show/hide details
  const handleHogClick = (index) => {
    setActiveHogIndex(activeHogIndex === index ? null : index);
  };

  // Toggle visibility of a hog
  const toggleHogVisibility = (index) => {
    setHogList(hogList.map((hog, idx) =>
      idx === index ? { ...hog, hidden: !hog.hidden } : hog
    ));
  };

  // Update form fields for adding a new hog
  const updateFormField = (event) => {
    const { name, value, type, checked } = event.target;
    setHogForm({
      ...hogForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Add new hog to hog list and reset form fields
  const submitHogForm = (event) => {
    event.preventDefault();
    setHogList([...hogList, hogForm]);
    setHogForm({
      name: '',
      specialty: '',
      greased: false,
      weight: '',
      "highest medal achieved": '',
      image: '',
      hidden: false
    });
    setShowModal(false); // Close modal after submitting
  };

  return (
    <div className="container text-center my-4">
      <h1 className='display-4'>Hog Showcase</h1>
      <Nav />

      {/* Button to trigger modal */}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add a New Hog
      </Button>

      {/* Modal containing the form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Hog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={submitHogForm}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={hogForm.name}
                onChange={updateFormField}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Specialty:</label>
              <input
                type="text"
                name="specialty"
                value={hogForm.specialty}
                onChange={updateFormField}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Greased:</label>
              <input
                type="checkbox"
                name="greased"
                checked={hogForm.greased}
                onChange={updateFormField}
                className="form-check-input"
              />
            </div>
            <div className="form-group">
              <label>Weight (kg):</label>
              <input
                type="number"
                name="weight"
                value={hogForm.weight}
                onChange={updateFormField}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Top Medal:</label>
              <input
                type="text"
                name="highest medal achieved"
                value={hogForm["highest medal achieved"]}
                onChange={updateFormField}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Image URL:</label>
              <input
                type="text"
                name="image"
                value={hogForm.image}
                onChange={updateFormField}
                required
                className="form-control"
              />
            </div>
            <Button variant="primary" type="submit" className="mt-3">
              Add Hog
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Display hogs */}
      <HogDisplay
        hogList={hogList}
        onHogClick={handleHogClick}
        activeHog={activeHogIndex}
        toggleHogVisibility={toggleHogVisibility}
      />
      
    </div>
  );
}

export default App;
