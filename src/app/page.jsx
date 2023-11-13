"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { Select, SelectItem } from "@nextui-org/react";
const baseURL = "http://localhost:3000/api/Sensores";

export default function Home() {
  const [sensores, setSensores] = useState([]);
  const [datasDisponiveis, setDatasDisponiveis] = useState();
  const [data, setData] = useState([])
  const [dataSelecionada, setDataSelecionada] = useState()

  const options = {
    title: "Dados do sensor",
    curveType: "function",
    legend: { position: "bottom" },
  };

  useEffect(() => {
    // Função para buscar os sensores
    const fetchSensores = async () => {
      try {
        const response = await axios.post(baseURL);
        setSensores(response.data.Sensores);
      } catch (error) {
        alert("Erro ao conectar ao banco de dados")
      }
    };

    // Execute a função inicialmente
    fetchSensores();

    // Configura um intervalo para buscar os sensores a cada 1 minuto
    const intervalId = setInterval(fetchSensores, 60000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
  const Exemple = [
    ["Horario", "Temperatura relativa", "Temperatura", 'Umidade'],
    [6, 22, 0, 5],
    [7, 10, 5, 7],
    [8, 23, 15, 23],
    [9, 17, 9, 5],
    [10, 18, 10, 23],
    [11, 9, 5, 2],
    [12, 11, 3, 22],
    [13, 27, 19, 11],
  ];
  function AlterDate(valor) {
    const dataString = valor.toString();
    const partesDaData = dataString.split("/");
    const dataFormatada = `${partesDaData[2]}-${partesDaData[1]}-${partesDaData[0]}T00:00:00.000Z`;

    const dataObj = new Date(dataFormatada);
    return(dataObj);
  }
  function pegarUltimoDia(array = sensores) {
    if (array && array.length > 0) {

      const ultimaData = new Date(array[array.length - 1].DATA);
      
      console.log(ultimaData)
      // Obtém a data no formato "dd/mm/yyyy"
       const dataFormatada = ultimaData.toLocaleDateString();
  
       // Obtém a hora no formato "hh:mm:ss"
       const horaFormatada = ultimaData.toLocaleTimeString();
  
      // // Combina a data e a hora no formato desejado
       const dataHoraFormatada = `${dataFormatada} ${horaFormatada}`;
  
      // // Define a data e hora formatadas
       setDataSelecionada(dataHoraFormatada);
    } else {
      // Retorna undefined se o array estiver vazio
      return undefined;
    }
  }
  const adicionarDados = (dataSelecionada = new Date()) => {
    if (sensores) {
      const filteredData = sensores
       .filter(sensor => new Date(sensor.DATA).toDateString() === dataSelecionada.toDateString())
        .slice(-10)
        .map((sensor) => {
          const dataString = sensor.DATA;
          const data = new Date(dataString);

          const minutos = data.getMinutes();
          const horas = data.getHours();

          // Convertendo os valores para números (removendo "N/A")
          const temperatura = parseFloat(sensor.TEMP) || 0;
          const temperaturaP = parseFloat(sensor.TEMP_P) || 0;
          const umidade = parseFloat(sensor.UMIDADE) || 0;

          const novoDado = [`${horas}:${minutos}`, temperatura, temperaturaP, umidade];

          return novoDado;
        });

      setData([["Hora", "Temperatura", "Temperatura Relativa", "Umidade"], ...filteredData]);

      // Salvar os dias disponíveis
      var lastDia = new Date();
      const uniqueDays = [...new Set(sensores.map(sensor =>{
        if(new Date(sensor.DATA).toLocaleDateString() !== lastDia){
          console.log( new Date(sensor.DATA).toLocaleDateString())
          lastDia = new Date(sensor.DATA).toLocaleDateString();          return new Date(sensor.DATA)
         
        }else{
          return;
        }
      } ))];
      setDatasDisponiveis(uniqueDays);
    } else {
      alert("Dados não adquiridos");
    }
  };
  useEffect(() => {
    adicionarDados();
    pegarUltimoDia();
    
  }, [sensores])
  
  const temperaturaPrecisao = sensores.length > 0 ? sensores[sensores.length - 1].TEMP : "N/A";
  const temperatura = sensores.length > 0 ? sensores[sensores.length - 1].TEMP_P : "N/A";
  const umidade = sensores.length > 0 ? sensores[sensores.length - 1].UMIDADE : "N/A";
  return (
    <main className="bg-teal-100 w-full h-full rounded-xl md:p-8 p-2">
      <div className="w-full h-full bg-white rounded-xl md:p-4 pt-4">
        <h1 className="text-teal-600 text-center md:text-3xl">Estufas</h1>
        <h2 className="text-center text-teal-400 md:text-xl text-md">
          Gráfico de temperatura de precisão
        </h2>
        <section className=" md:grid md:grid-cols-3 gap-4 pt-10 flex flex-col ">
          <div className="m-auto border-2 md:border-none md:p-4 p-6 rounded-xl">
            <p className="md:text-4xl text-xl text-center font-bold">{temperaturaPrecisao} C°</p>
            <p className="text-center md:mt-4 md:border-2 rounded-xl md:py-1 md:px-8 text-md md?shadow-md">Temperatura de precisão</p >
          </div>
          <div className="m-auto border-2 md:border-none md:p-4 p-6 rounded-xl">
            <p className="md:text-4xl text-xl text-center font-bold">{temperatura} C°</p>
            <p className="text-center md:mt-4 md:border-2 rounded-xl md:py-1 md:px-8 text-md md:shadow-md">Temperatura de Relativa</p >
          </div>
          <div className="m-auto border-2 md:border-none md:p-4 p-6 rounded-xl">
            <p className="md:text-4xl text-xl text-center font-bold">{umidade} C°</p>
            <p className="text-center md:mt-4 md:border-2 rounded-xl md:py-1 md:px-8 text-md md:shadow-md">Umidade </p >
          </div>
        </section>
        <section className="md:mb-0 mb-10 w-full md:h-auto flex flex-col justify-center items-center">
          <Select label="Selecione a data"
            onChange={(e) => {
              adicionarDados(new Date(datasDisponiveis[e.target.value]));
            }}
            className="max-w-xs  " >
            {datasDisponiveis?.map((datas, index) => (
             datas?  <SelectItem key={index} value={datas} className="">
             {datas&&new Date(datas).toLocaleDateString()}
           </SelectItem>: ''
             
            ))}
          </Select>
          <Chart
            chartType="LineChart"
            width="100%"
            height="300px"
            data={data}
            options={options}
          />
        </section>
        <section>
          <p className="text-end  md:text-sm text-[10px] pr-4 md:pr-0 ">Ultima atualização {dataSelecionada}  </p>

        </section>
      </div>
    </main>
  );
}
