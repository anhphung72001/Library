const STORAGE = {
  TOKEN: "token",
  USER_INFO: "user-info",
};

export const getStorage = (name) => {
  let data =
    typeof window !== "undefined" && name !== undefined
      ? sessionStorage.getItem(name)
      : "";
  try {
    if (data) return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

export const setStorage = (name, value) => {
  const stringify = typeof value !== "string" ? JSON.stringify(value) : value;
  return sessionStorage.setItem(name, stringify);
};

export const deleteStorage = (name) => {
  return sessionStorage.removeItem(name);
};

export const clearStorage = () => {
  return sessionStorage.clear();
};

export default STORAGE;
