# WS2801-client

WS2801-client is a client for the [WS2801-webserver package](https://www.npmjs.com/package/ws2801-webserver).

## Usage

```typescript
import {LedColor, WS2801Client} from './src/index';

const client: WS2801Client = new WS2801Client('http://localhost:45451');

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
```

## Functions

### Constructor

#### Parameters:

- `baseUrl`
  - Type: string
  - The url of the WS2801-webserver.

- `apiKey`
  - optional
  - Type: string
  - The apiKey to be used for authorization on the webserver.
    - If a valid apiKey is set in the constructor, registration and login is not required.

### setApiKey

Sets the apiKey that will be used for the requests.

#### Parameters

- apiKey
  - Type: string
  - The apiKey to be used.

### dispose

Disconnects the socket.io client.

### loginRequired

Returns whether authorization is required or not.

#### Returns

Whetger authorization is required or not.
- Type: Promise<boolean>

### register

Registers at the webserver.

#### Parameters

- username
  - Type: string
  - The username to use for registeration.

- password
  - Type: string
  - The password to use for registeration.

#### Returns

The apiKey for the registered user.
- Type: Promise<string>

### login

Logs in to the webserver.

#### Parameters

- username
  - Type: string
  - The username to use when logging in.

- password
  - Type: string
  - The password to use when logging in.

#### Returns

The apiKey for the logged in user.
- Type: Promise<string>


### getLedStrip

Returns the current state of the led strip.

#### Returns

The current state of the led strip.
- Type: Promise<[LedStrip](./src/types/led-strip.ts)>

### fillLedStrip

Fills the entire led strip in one color.

#### Parameters

- color
  - Type: [LedColor](./src/types/led-color.ts)
  - The color that the led strip should become.

- brightness
  - optional
  - Type: number | 'auto'
  - The brightness in percent to which the led strip should be set.

#### Returns

The current state of the led strip.
- Type: Promise<[LedStrip](./src/types/led-strip.ts)>

### clearLedStrip

Clears the entire led strip.

#### Returns

The current state of the led strip.
- Type: Promise<[LedStrip](./src/types/led-strip.ts)>

### setLed

Sets the color of a single led.

#### Parameters

- ledIndex
  - Type: number
  - The index of the led to be changed.

- brightness
  - optional
  - Type: number | 'auto'
  - The brightness in percent to set the led strip to.

#### Returns

The current state of the led strip.
- Type: Promise<[LedStrip](./src/types/led-strip.ts)>

### setLedStrip

Sets a color for each led.

#### Parameters

- ledStrip
  - Type: [LedStrip](./src/types/led-strip.ts)
  - An array of LedColors. Must contain exactly one entry for each led.

- brightness
  - optional
  - Type: number | 'auto'
  - The brightness in percent to set the led strip to.

#### Returns

The current state of the led strip.
- Type: Promise<[LedStrip](./src/types/led-strip.ts)>

### setBrightness

Sets the brightness of the led strip.

#### Parameters

- brightness
  - Type: number | 'auto'
  - The brightness in percent to which the led strip should be set.

### getBrightness

Returns the current brightness of the led strip.
#### Returns

The current brightness of the led strip.
- Type: Promise<number | 'auto'>


### startAnimation

Starts an animation.

#### Parameters

- animationScript
  - Type: string
  - The animation script that should be executed. The animation script can access the [LED controller](https://github.com/SteffenKn/WS2801-PI/blob/master/src/index.ts#L44) via `ledController` and the amount of Leds via `ledAmount`.

#### Returns

A promise that resolves once the animation has started, which contains a finishPromise that resolves once the animation has finished.

Promise<{finishPromise: Promise<void>}>

### stopAnimation

Stops the current animation, if an animation is running.

### waitForAnimationToFinish

Resolves when the current animation is finished. If no animation is running, it resolves immediately.

## Listeners

### onLedStripChanged

Creates a listener with a callback that is executed each time the led strip is changed.

#### Parameters

- callback
  - Type: (ledStrip: [LedStrip](./src/types/led-strip.ts) => void | Promise<void>
  - The callback to be called each time the led strip is changed.

#### Returns

The id of the created listener.
- Type: string

### onBrightnessChanged

Creates a listener with a callback that is executed each time the brightness is changed.

#### Parameters

- callback
  - Type: (brightness: number) => void | Promise<void>
  - The callback to be called each time the brightness is changed.

#### Returns

The id of the created listener.
- Type: string

### removeListener

Removes a listener.

#### Parameters

- id
  - Type: string
  - The id of the listener to be removed.
