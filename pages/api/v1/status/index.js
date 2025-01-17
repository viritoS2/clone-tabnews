import  database  from "infra/database.js";

async function status(request, response){
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnectionsValue = databaseMaxConnectionsResult.rows[0].max_connections;
  
  const databaseName = process.env.POSTGRES_DB
  const usedConnectionsResult = await database.query({
    text:"SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  });
  const databaseOpenedConnectionsValue = usedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at : updatedAt,
    dependencies : {
      database: {
        version: databaseVersionValue,
        max_connections : parseInt(maxConnectionsValue),
        used_connections : databaseOpenedConnectionsValue,
        opened_connection: databaseOpenedConnectionsValue
      },  
    },
  })
}
export default status