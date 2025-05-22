import { Client } from 'pg';

export const waitUntilOnline = async (url: string, timeout = 500) => {
  while (true) {
    const client = new Client({ connectionString: url });

    try {
      await client.connect();
      await client.query('SELECT 1');
      console.log('✅ Postgres is ready');
      await client.end();

      break;
    } catch (err) {
      console.log('Waiting for Postgres...', err.message);
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }
};
