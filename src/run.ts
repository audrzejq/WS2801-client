import {LedColor, WS2801Client} from './index';

const client: WS2801Client = new WS2801Client('http://192.168.1.21:45451');

async function register(): Promise<void> {
  if (!(await client.loginRequired())) {
    console.log('No registration needed.');

    return;
  }

  const apiKey: string = await client.register('<username>', '<password>');

  console.log(`Successfully registered (${apiKey}).`);
}

async function turnLightOn(): Promise<void> {
  const red: LedColor = {
    red: 255,
    green: 0,
    blue: 0,
  };

  await client.fillLedStrip(red);

  console.log('Ledstrip is now red.');
}

async function run(): Promise<void> {
  await register();
  await turnLightOn();
}
run();
