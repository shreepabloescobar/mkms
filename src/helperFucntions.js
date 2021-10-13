export const getUserData = (userObject) => {
  return {
    username: userObject.name ? userObject.name : userObject.me.name,
    email: userObject.emails
      ? userObject.emails[0].address
      : userObject.me.emails[0].address,
    status: userObject.status ? userObject.status : userObject.me.status,
  };
};
