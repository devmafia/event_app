// queries.js
import { gql } from '@apollo/client';

export const FETCH_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      date
      category
      place
      price
      availableSeats
      image
    }
  }
`;

export const ADD_EVENT = gql`
  mutation AddEvent(
    $title: String!
    $description: String!
    $date: String!
    $category: String!
    $place: String!
    $price: String!
    $availableSeats: Int!
    $image: Upload
  ) {
    addEvent(
      title: $title
      description: $description
      date: $date
      category: $category
      place: $place
      price: $price
      availableSeats: $availableSeats
      image: $image
    ) {
      id
      title
      description
      date
      category
      place
      price
      availableSeats
      image
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $id: ID!
    $title: String!
    $description: String!
    $date: String!
    $category: String!
    $place: String!
    $price: String!
    $availableSeats: Int!
    $image: Upload
  ) {
    updateEvent(
      id: $id
      title: $title
      description: $description
      date: $date
      category: $category
      place: $place
      price: $price
      availableSeats: $availableSeats
      image: $image
    ) {
      id
      title
      description
      date
      category
      place
      price
      availableSeats
      image
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;
