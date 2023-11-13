import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const access = {
  host: 'localhost',
  user: 'root',
  database: 'db_sensores',
};

async function ReqCols(conn:any) {
  const [rows] = await conn.execute('SELECT * FROM sensores');
  return rows;
}

export async function POST(request: Request) {
  try {
    // Tente criar a conexão
    const conn = await mysql.createConnection(access);

    // Aguarde o resultado da função ReqCols antes de retornar a resposta
    const result = await ReqCols(conn);

    // Feche a conexão após usar
    await conn.end();

    return NextResponse.json({ Sensores: result });
  } catch (error:any) {
    console.error('Erro ao conectar ao banco de dados:', error);

    // Verifique se o erro é relacionado à falta de conexão ou outro problema específico
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      return NextResponse.json({ error: 'Conexão com o banco de dados perdida.' });
    } else {
      return NextResponse.json({ error: 'Erro ao processar a solicitação.' });
    }
  }
}
