 

export const __authServiceModuleFix = true;

// Stub login implementation added by fix script
export const login = async (username: string, password: string): Promise<void> => {
  // TODO: replace with real authentication logic
  console.log('login called for', username);
};
