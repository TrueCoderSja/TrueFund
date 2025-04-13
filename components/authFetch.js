export default async function authFetch (url, options = {}, sessionToken) {
    try {
      // If no sessionToken in context, prevent requests
      if (!sessionToken) {
        throw new Error('No session token found');
      }
  
      // Adding sessionToken to cookies (by setting it in headers, simulating a cookie)
      const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Cookie': `sessionToken=${sessionToken}`, // Set the cookie manually
      };

      console.log({
        ...options,
        headers,
      });
  
      const response = await fetch(url, {
        ...options,
        headers,
      });
  
      // Handle non-200 response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
  
      return response.json();
    } catch (err) {
      console.error('fetchWithAuth error:', err);
      throw err;
    }
  };