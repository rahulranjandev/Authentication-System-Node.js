import axios from 'axios';
import qs from 'qs';
import {
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  GITHUB_OAUTH_REDIRECT_URL,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URL,
} from '../config/config.js';

class GitHub {
  getAccessToken = async (code) => {
    const rootUrl = 'https://github.com/login/oauth/access_token';
    const options = {
      client_id: GITHUB_OAUTH_CLIENT_ID,
      client_secret: GITHUB_OAUTH_CLIENT_SECRET,
      code,
    };
    const queryString = qs.stringify(options);

    try {
      const { data } = await axios.post(`${rootUrl}?${queryString}`, null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const decoded = qs.parse(data);
      return decoded.access_token;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  getUser = async (accessToken) => {
    const rootUrl = 'https://api.github.com/user';
    const emailUrl = 'https://api.github.com/user/emails';

    try {
      const [user, email] = await Promise.all([
        axios.get(rootUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        axios.get(emailUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);

      const primaryEmail = email.data.find((email) => email.primary === true).email;

      const userData = {
        ...user.data,
        email: primaryEmail,
      };

      return userData;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };
}

class Google {
  getAccessToken = async ({ code }) => {
    const rootUrl = 'https://oauth2.googleapis.com/token';
    const redirectUrl = GOOGLE_OAUTH_REDIRECT_URL;
    const options = {
      code,
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: redirectUrl,
      grant_type: 'authorization_code',
    };
    const queryString = qs.stringify(options);

    try {
      const { data } = await axios.post(`${rootUrl}?${queryString}`, null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  getUser = async ({ id_token, access_token }) => {
    const rootUrl = 'https://www.googleapis.com/oauth2/v1/userinfo';
    const queryStr = `?alt=json&access_token=${access_token}`;

    try {
      const { data } = await axios.get(`${rootUrl}${queryStr}`, {
        headers: { Authorization: `Bearer ${id_token}` },
      });

      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };
}

export { GitHub, Google };
