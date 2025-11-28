export const AuthError = (error: Error) => {
  if (error) {
    console.log(error);
    throw error;
  }
};
