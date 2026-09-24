import postgres from 'postgres';
const sql = postgres('postgres://postgres:senaisp@localhost:5432/Mecanica2');
export default sql;