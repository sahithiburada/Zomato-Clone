import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('');
  const [averageSpend, setAverageSpend] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Fetch all restaurants initially
  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/restaurants');
      const data = await response.json();
      if (Array.isArray(data)) setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle search based on filters
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (country) params.append('country', country);
      if (averageSpend) params.append('average_spend', averageSpend);
      if (cuisine) params.append('cuisine', cuisine);
      if (searchQuery) params.append('search_query', searchQuery);
      if (latitude) params.append('latitude', latitude);
      if (longitude) params.append('longitude', longitude);

      console.log("API Request:", `http://127.0.0.1:5000/search-restaurants?${params.toString()}`);

      const response = await fetch(`http://127.0.0.1:5000/search-restaurants?${params.toString()}`);
      const data = await response.json();

      if (Array.isArray(data)) setRestaurants(data);
    } catch (error) {
      console.error("Error searching restaurants:", error);
    }
  };

  return (
    <Container>
      <TopBar>
        <Logo src="/zomologo.png" alt="Logo" />
        <SearchBar>
          <SearchInput type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search restaurants..." />
          <SearchIcon onClick={handleSearch} />
        </SearchBar>
      </TopBar>

      <FiltersContainer>
        <FilterInput type="text" value={averageSpend} onChange={(e) => setAverageSpend(e.target.value)} placeholder="Average Spend for Two" />
        <FilterInput type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="Filter by Cuisine" />
        <FilterInput type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Enter Latitude" />
        <FilterInput type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Enter Longitude" />
        <FilterButton onClick={handleSearch}>Search</FilterButton>
      </FiltersContainer>

      <RestaurantGrid>
        {restaurants.length === 0 && <NoResults>No results found.</NoResults>}
        {restaurants.map((restaurant) => (
          <Card key={restaurant.restaurant_id}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisines} | ${restaurant.average_cost} for two</p>
            <StyledTextLink to={`/restaurant/${restaurant.restaurant_id}`}>View Details</StyledTextLink>
          </Card>
        ))}
      </RestaurantGrid>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background-color: #FFFAF0;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color:rgb(253, 243, 201);
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const Logo = styled.img`
  height: 90px;
  width: auto;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #F85E00;
  border-radius: 25px;
  padding: 6px 12px;
  width: 320px;
  background-color: white;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  padding: 8px;
  font-size: 15px;
`;

const SearchIcon = styled(FaSearch)`
  color: #F85E00;
  cursor: pointer;
  font-size: 18px;
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const FilterInput = styled.input`
  padding: 10px;
  width: 220px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const FilterButton = styled.button`
  padding: 10px 15px;
  background-color: #F85E00;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const Card = styled.div`
  background-color: #FFF7D7;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-size: 1.3rem;
    color: #2c3e50;
  }

  p {
    color: #7f8c8d;
    margin-bottom: 12px;
  }
`;

const StyledTextLink = styled(Link)`
  font-size: 1rem;
  color: #F85E00;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const NoResults = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #F85E00;
`;

export default RestaurantListPage;
