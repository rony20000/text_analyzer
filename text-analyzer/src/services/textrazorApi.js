import axios from "axios";

const baseUrl = "http://localhost:3001";

const analyizeText = async (text) => {
  const { data } = await axios.post(`${baseUrl}/textrazor`, {
    text,
  });

  return data.response.entities;
};

export default { analyizeText };
