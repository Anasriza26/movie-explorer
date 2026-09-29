export const DEMO_CREDENTIALS = {
  username: process.env.REACT_APP_DEMO_USERNAME,
  password: process.env.REACT_APP_DEMO_PASSWORD,
};

export const loginRequest = ({ username, password }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const validUser =
        username.toLowerCase() ===
        DEMO_CREDENTIALS.username.toLowerCase();

      const validPass =
        password === DEMO_CREDENTIALS.password;

      if (validUser && validPass) {
        resolve({
          username: DEMO_CREDENTIALS.username,
        });
      } else {
        reject(new Error('Invalid username or password.'));
      }
    }, 600);
  });