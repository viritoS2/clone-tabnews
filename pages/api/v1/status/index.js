import  database  from "/home/vitor/code/clone-tabnews/infra/database.js";

async function status(request, response){

  const result = await database.query("SELECT 1 + 1 as sum;");
  console.log(result.rows)
  response.status(200).json({chave: "São acima da média"})
}
export default status