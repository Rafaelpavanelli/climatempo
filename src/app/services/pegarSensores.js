const fetchSensores = async () => {
  try {
    const response = await axios.post(baseURL);
    setSensores(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Erro ao obter os sensores:', error);
  }
};