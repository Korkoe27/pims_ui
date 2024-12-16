import axios from 'axios';

// Mocking axios for the test
jest.mock('axios');

describe('Login and fetch CSRF token', () => {
  beforeEach(() => {
    // Simulate a browser-like environment with jsdom
    Object.defineProperty(global, 'document', {
      value: {
        cookie: '',
      },
      writable: true,
    });
  });

  it('should set CSRF token after login', async () => {
    // Mock the login endpoint response
    axios.post.mockResolvedValue({
      status: 200,
      data: { message: 'Login successful' },
      headers: { 'set-cookie': ['sessionid=value; csrftoken=mock_csrf_token'] },
    });

    // Perform login
    const response = await axios.post('auth/api/login/', {
      username: 'admin', // Replace with valid credentials
      password: 'admin', // Replace with valid credentials
    });

    // Set cookies as if they came from the response headers
    document.cookie = response.headers['set-cookie'].join('; ');

    // Extract the CSRF token from the cookies
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const csrfToken = getCookie('csrftoken');

    // Log the CSRF token (optional for debugging)
    console.log('CSRF Token:', csrfToken);

    // Validate the CSRF token
    expect(csrfToken).toBeDefined();
    expect(csrfToken).toBe('mock_csrf_token');
  });
});
