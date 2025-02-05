import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const RestaurantDetailPage = () => {
  const { id } = useParams(); // Extract restaurant ID from URL
  const [restaurant, setRestaurant] = useState(null);

  // Fetch the restaurant details based on ID
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // ✅ Correct API Call with backticks (`) for string interpolation
        const response = await fetch(`http://127.0.0.1:5000/restaurant/${id}`);
        if (!response.ok) {
          throw new Error('Restaurant not found');
        }
        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  // Show loading or error if restaurant is not found
  return restaurant ? (
    <Container>
      <DetailCard>
        <h2>{restaurant.name}</h2>
        <p><strong>Address:</strong> {restaurant.address}</p>
        <p><strong>Cuisine:</strong> {restaurant.cuisines}</p>
        <p><strong>Average Cost for Two:</strong> ${restaurant.average_cost}</p>
        <p><strong>Rating:</strong> {restaurant.aggregate_rating}/5</p>
        <BackLink to="/">Back to Restaurant List</BackLink>
      </DetailCard>
    </Container>
  ) : (
    <LoadingText>Loading...</LoadingText>
  );
};

// Styled Components for the restaurant detail page
const Container = styled.div`
  background-color: #FFFAF0;
  padding: 40px 20px;
  max-width: 800px;
  margin: auto;
`;

const DetailCard = styled.div`
  background-color: #FFF7D7;
  padding: 30px;
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 15px;
    font-weight: bold;
  }

  p {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 12px;
    line-height: 1.6;
  }

  strong {
    color: #F85E00;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  font-size: 1.2rem;
  color: #F85E00;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #F85E00;
`;

export default RestaurantDetailPage;
