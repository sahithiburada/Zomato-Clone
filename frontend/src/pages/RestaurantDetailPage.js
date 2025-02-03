import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const response = await fetch(`http://127.0.0.1:5000/restaurant/${id}`);
      const data = await response.json();
      
      setRestaurant(data);
    };

    fetchRestaurant();
  }, [id]);

  return restaurant ? (
    <Container>
      <DetailCard>
        <h2>{restaurant.name}</h2>
        <p><strong>Address:</strong> {restaurant.address}</p>
        <p><strong>Cuisine:</strong> {restaurant.cuisines}</p>
        <p><strong>Average Cost for Two:</strong> ${restaurant.average_cost}</p>
        <p><strong>Rating:</strong> {restaurant.aggregate_rating}/5</p>
      </DetailCard>
    </Container>
  ) : (
    <div>Loading...</div>
  );
};

// Styled components for CSS-in-JS
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const DetailCard = styled.div`
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.1rem;
    color: #7f8c8d;
    margin-bottom: 10px;
  }
`;

export default RestaurantDetailPage;