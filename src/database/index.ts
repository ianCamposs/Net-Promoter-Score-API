import { Connection, createConnection, getConnectionOptions } from "typeorm"

export default async (): Promise<Connection> => {
  //pegando as mesmas configurações do BD original
  const defaultOptions = await getConnectionOptions()

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === "test"
        ? "./src/database/database.test.sqlite"
        : defaultOptions.database,
    })
  )

}