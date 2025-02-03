import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('');
  const [averageSpend, setAverageSpend] = useState('');
  const [cuisine, setCuisine] = useState('');

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    const response = await fetch('http://127.0.0.1:5000/restaurants');
    const data = await response.json();
    setRestaurants(data);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearch = async () => {
    const params = new URLSearchParams();

    // Add filters to the request
    if (country) params.append('country', country);
    if (averageSpend) params.append('average_spend', averageSpend);
    if (cuisine) params.append('cuisine', cuisine);
    if (searchQuery) params.append('search_query', searchQuery);

    // Send request to Flask backend
    const response = await fetch(`http://127.0.0.1:5000/search-restaurants?${params.toString()}`);
    const data = await response.json();
    setRestaurants(data);
  };

  return (
    <Container>
      <Header>Restaurant List</Header>

      {/* Search Bar */}
      <SearchContainer>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or description"
        />
        <Button onClick={handleSearch}>Search</Button>
      </SearchContainer>

      {/* Filters */}
      <FiltersContainer>
        <Input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Filter by Country"
        />
        <Input
          type="text"
          value={averageSpend}
          onChange={(e) => setAverageSpend(e.target.value)}
          placeholder="Average Spend for Two"
        />
        <Input
          type="text"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Filter by Cuisine"
        />
        <Button onClick={handleSearch}>Apply Filters</Button>
      </FiltersContainer>

      {/* Restaurant Cards */}
      <RestaurantCards>
        {restaurants.length === 0 && <p>No results found.</p>}
        {restaurants.map((restaurant) => (
          <Card key={restaurant.restaurant_id}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisines} | ${restaurant.average_cost} for two</p>
            <a href={`/restaurant/${restaurant.restaurant_id}`} className="link">
              View Details
            </a>
          </Card>
        ))}
      </RestaurantCards>
    </Container>
  );
};

// Styled components for CSS-in-JS
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  width: 200px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #187bcd;
  }
`;

const RestaurantCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 200px;
  text-align: center;

  h3 {
    font-size: 1.2rem;
    color: #2c3e50;
  }

  p {
    color: #7f8c8d;
    margin-bottom: 10px;
  }

  .link {
    color: #1e90ff;
    text-decoration: none;
    font-weight: bold;
  }

  .link:hover {
    text-decoration: underline;
  }
`;

export default RestaurantListPage;
