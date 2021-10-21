import axios from "axios";
//
import { LOGIN_API } from "lib/constants";

/**
 * Authentication API function
 * @param {email} useremail
 * @param {password} password
 * @returns
 */
export const login = async (useremail, password) => {
  const userBody = { user: useremail, password: password };

  try {
    const response = await axios.post(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + LOGIN_API,
      userBody
    );

    return response.data.data;
  } catch (error) {
    return Promise.reject(error.response);
  }
};

/**
 * Get Agent Information
 * @returns userData
 */
// export const getAgentInformation = async () => {
//   const { headers, userId } = getTokenfromStorage();

//   try {
//     const response = await axios.get(
//       process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + AGENT_INFO + userId,
//       {
//         headers: headers,
//       }
//     );
//     const user = response.data.user;
//     return user;
//   } catch (error) {
//     console.log(error);
//     throw new Error(error.message);
//   }
// };
