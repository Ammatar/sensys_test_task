const express = require('express');
const db = require('./db');
const PORT = process.env.PORT || 3000;

const app = express();

// Мидлвар для возможности использования JSON в запросах
app.use(express.json());
// Небольшая дока по Endpoint
app.get('/', (req, res) => {
  const doc =
    '/gps_data_stat - Принимает user_id, start_date, end_date <br> /gps_data_income - Принимает user_id, latitud, longitud, добавляет текущую дату и время <br> /getAllData - Не принимает аргументов отдает всю таблицу';
  res.send(doc);
});
// Принимает user_id, latitud, longitud, добавляет текущую дату и время
app.post('/gps_data_income', async (req, res) => {
  const { user_id, latitud, longitud } = req.body;
  //   Запись в базу данных  user_id, latitud, longitud, добавляет текущую дату и время
  const date = new Date();
  const user = await db.query(
    `INSERT INTO gps_coord (user_id, latitud, longitud) values ($1, $2, $3) RETURNING *`,
    [user_id, latitud, longitud]
  );
  res.send(`${user.rows}`);
});
// Принимает user_id, start_date, end_date
app.post('/gps_data_stat', async (req, res) => {
  let { user_id, start_date, end_date } = req.body;
  // Проверка на открытые условия
  if (!start_date) {
    start_date = '1900-04-01';
  }
  if (!end_date) {
    end_date = '2254-04-01';
  }
  const data = await db.query(
    `SELECT * FROM gps_coord WHERE user_id = '${user_id}' AND entrydate <@
    tsrange('${start_date}', '${end_date}'::date + 2, '[)');`
  );
  res.send(data.rows);
});
// Не принимает аргументов отдает всю таблицу
app.get('/getAllData', async (req, res) => {
  const users = await db.query(`SELECT * FROM gps_coord`);
  let usersString = '';
  users.rows.forEach((e) => {
    usersString +=
      e.user_id +
      ' ' +
      e.latitud +
      ' ' +
      e.longitud +
      ' ' +
      e.entrydate +
      '<br>';
  });
  res.send(usersString);
});
// Запуск сервера на порту 3000
app.listen(PORT, () => {
  console.log('Server started at ' + PORT);
});
