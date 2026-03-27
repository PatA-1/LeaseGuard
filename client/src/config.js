const isMobileTest = true;

const HOST = isMobileTest ? "192.168.4.50" : "localhost";

export const API_URL = `http://${HOST}:5000/api`;
export const SERVER_URL = `http://${HOST}:5000`;