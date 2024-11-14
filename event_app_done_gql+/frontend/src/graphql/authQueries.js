const LOGIN_USER = gql`
  mutation loginUser($username: String!, $email: String!, $password: String!) {
    loginUser(username: $username, email: $email, password: $password) {
      token
      userId
      message
    }
  }
`;

const LOGIN_ADMIN = gql`
  mutation loginAdmin($username: String!, $email: String!, $password: String!) {
    loginAdmin({ username: $username, email: $email, password: $password}) {
      message
      token
      userId
    }
  }
`;

const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    registerUser({ username: $username, email: $email, password: $password }) {
      message
      token
      userId
    }
  }
`;
