import { useState, useEffect, useRef } from "react";

function NationalityPredictor() {
  // State to store the name input value
  const [name, setName] = useState("");

  // State to store the fetched nationality data
  const [nationality, setNationality] = useState(null);

  // Ref to focus the input field on component mount
  const inputRef = useRef(null);
  console.log(inputRef);

  // Focus the input field on component mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Async function to fetch nationality data from the API
  async function fetchNationality() {
    try {
      const response = await fetch(`https://api.nationalize.io?name=${name}`);
      const data = await response.json();
      if (data.country.length > 0) {
        // If nationality data is available
        setNationality(data.country[0]); // Extract the first country data
      } else {
        setNationality(null); // If no nationality data is available, set nationality state to null
      }
    } catch (error) {
      console.error("Error fetching nationality:", error); // Log any errors that occur during fetch
    }
  }

  // Handler for input value change
  const handleNameChange = (event) => {
    setName(event.target.value); // Prevent default form submission behavior
    setNationality(null); // Clear the nationality when there is change in input
  };

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchNationality();
  };

  return (
    <div className="container">
      <h1>Nationality Predictor</h1>
      {/* Form with input and submit button */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter a name"
          ref={inputRef}
          className="input-field"
        />
        <button type="submit" className="predict-button">
          Predict Nationality
        </button>
      </form>

      {/* Display nationality data if available */}
      {nationality && (
        <div className="result-container">
          <h2>Result:</h2>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Country ID:</strong> {getCountryName(nationality.country_id)}</p>
          <p><strong>Probability:</strong> {(nationality.probability * 100).toFixed(0)}%</p>
        </div>
      )}
    </div>
  );
}

// Function to get country name using country code
function getCountryName(countryCode) {
  try {
    const displayName = new Intl.DisplayNames(["en"], { type: "region" });
    return displayName.of(countryCode);
  } catch (error) {
    console.error("Error getting country name:", error);
    return "Unknown";
  }
}

export default NationalityPredictor;
