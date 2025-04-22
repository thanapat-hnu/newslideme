import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "26.151.30.37",
    port: 3306,
    user: "root",
    password: "root",
    database: "slideme"
});

pool.getConnection()
    .then(connection => {
        console.log("MySQL successfully connected!");
        console.log("Testing connection...");
        return connection.query('SELECT COUNT(*) as count FROM order_cus')
            .then(([rows]) => {
                console.log('Total orders in database:', rows[0].count);
                connection.release();
            });
    })
    .catch((err) => {
        console.error("Database connection error:", err.message);
    });

export default pool;