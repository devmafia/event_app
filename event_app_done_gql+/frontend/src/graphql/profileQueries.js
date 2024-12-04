import { gql } from 'graphql-tag';

export const FETCH_USER_DATA = gql`
  query FetchUserData ($id: Int!) {
    getUserdata(userId: $id)
    user {
      id
      username
      email
    }
  }
`;

export const FETCH_USER_BOOKINGS = gql`
  query FetchUserBookings {
    getBookings {
      id
      guestName
      guestEmail
      phone
      totalPrice
      createdAt
      events {
        id
        title
        description
        price
        image
        date
      }
      seats {
        id
        seatNumber
        eventId
      }
    }
  }
`;

export const UPDATE_USERNAME = gql`
  mutation UpdateUsername($id: ID!, $username: String!) {
    updateUsername(id: $id, username: $username) {
      username
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($id: ID!, $email: String!) {
    updateEmail(id: $id, email: $email) {
      email
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($id: ID!, $password: String!) {
    updatePassword(id: $id, password: $password) {
      success
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
    }
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id) {
      success
    }
  }
`;
