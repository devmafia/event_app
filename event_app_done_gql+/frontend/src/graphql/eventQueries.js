// queries.js
import { gql } from 'graphql-tag';

export const FETCH_EVENTS = gql`
  query GetEvents {
    getAllEvents {
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

export const GET_EVENT_DETAILS = gql`
  query GetEventDetails($id: Int!) {
    getEvent(id: $id) {
      id
      title
      date
      description
      price
      image
      place
      category
      seats {
        id
        seatNumber
        isBooked
      }
    }
  }
`;

// export const ADD_EVENT = gql`
//   mutation AddEvent(
//     $input: CreateEventDto!
//   ) {
//     createEvent (
//       input: $input
//     ) {
//       id
//       title
//       description
//       date
//       category
//       place
//       price
//       availableSeats
//       image
//     }
//   }
// `;

// export const UPDATE_EVENT = gql`
//   mutation UpdateEvent(
//     $id: ID!
//     $title: String!
//     $description: String!
//     $date: String!
//     $category: String!
//     $place: String!
//     $price: String!
//     $availableSeats: Int!
//     $image: Upload
//   ) {
//     updateEvent(
//       id: $id
//       title: $title
//       description: $description
//       date: $date
//       category: $category
//       place: $place
//       price: $price
//       availableSeats: $availableSeats
//       image: $image
//     ) {
//       id
//       title
//       description
//       date
//       category
//       place
//       price
//       availableSeats
//       image
//     }
//   }
// `;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;
