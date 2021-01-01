import md5 from 'md5';
import {Response as FetchResponse} from 'node-fetch';

import {LedColor, LedStrip} from './types/index';

import {HttpClient} from './http-client';
import {SocketClient} from './socket-client';

export * from './types/index';

export class WS2801PiWebServerClient {
  private httpClient: HttpClient;
  private socketClient: SocketClient;

  constructor(baseUrl: string, apiKey?: string) {
    if (!baseUrl.startsWith('https://') && !baseUrl.startsWith('http://')) {
      baseUrl = `http://${baseUrl}`;
    }
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }

    this.httpClient = new HttpClient(baseUrl, apiKey);

    this.socketClient = new SocketClient(baseUrl);
  }

  public setApiKey(apiKey: string): void {
    this.httpClient.setApiKey(apiKey);
  }

  public async loginRequired(): Promise<boolean> {
    const response: FetchResponse = await this.httpClient.get('/login-required');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not check if login is required: ${errorMessage}`);
    }

    const result: {loginRequired: boolean} = await response.json();

    return result.loginRequired;
  }

  public async register(username: string, password: string): Promise<string> {
    const apiKey: string = md5(`${username}__${password}`);
    const body: string = JSON.stringify({name: username, apiKey: apiKey});

    const response: FetchResponse = await this.httpClient.post('/register', {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not register: ${errorMessage}`);
    }

    const result: {apiKey: string} = await response.json();

    this.httpClient.setApiKey(apiKey);

    return result.apiKey;
  }

  public async login(username: string, password: string): Promise<string> {
    const apiKey: string = md5(`${username}__${password}`);

    this.httpClient.setApiKey(apiKey);

    const response: FetchResponse = await this.httpClient.post('/login');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not login: ${errorMessage}`);
    }

    return apiKey;
  }

  public async getLedStrip(): Promise<LedStrip> {
    const response: FetchResponse = await this.httpClient.get('/led-strip');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not get led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async fillLedStrip(color: LedColor): Promise<LedStrip> {
    const body: string = JSON.stringify({color: color});

    const response: FetchResponse = await this.httpClient.post('/led-strip/fill', {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not fill led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async clearLedStrip(): Promise<LedStrip> {
    const response: FetchResponse = await this.httpClient.post('/led-strip/clear');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not clear led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async setLed(ledIndex: number, color: LedColor): Promise<LedStrip> {
    const body: string = JSON.stringify({color: color});

    const response: FetchResponse = await this.httpClient.post(`/led-strip/led/${ledIndex}/set`, {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not set color of led ${ledIndex}: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async setLedstrip(ledStrip: LedStrip): Promise<LedStrip> {
    const body: string = JSON.stringify({ledStrip: ledStrip});

    const response: FetchResponse = await this.httpClient.post(`/led-strip/set`, {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not set color of led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async setBrightness(brightness: number | 'auto'): Promise<LedStrip> {
    const body: string = JSON.stringify({brightness: brightness});

    const response: FetchResponse = await this.httpClient.post(`/led-strip/brightness/set`, {body: body});

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not set brightness of led strip: ${errorMessage}`);
    }

    const result: {ledStrip: LedStrip} = await response.json();

    return result.ledStrip;
  }

  public async getBrightness(): Promise<number | 'auto'> {
    const response: FetchResponse = await this.httpClient.get(`/led-strip/brightness`);

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not get brightness of led strip: ${errorMessage}`);
    }

    const result: {brightness: number} = await response.json();

    return result.brightness;
  }

  public onLedStripChanged(callback: (ledStrip: LedStrip) => void | Promise<void>): string {
    return this.socketClient.onLedStripChanged(callback);
  }

  public onBrightnessChanged(callback: (brightness: number) => void | Promise<void>): string {
    return this.socketClient.onBrightnessChanged(callback);
  }

  public removeListener(id: string): void {
    this.socketClient.removeListener(id);
  }

  public async startAnimation(animationScript: string): Promise<{finishPromise: Promise<void>}> {
    const body: string = JSON.stringify({animationScript: animationScript});

    const startResponse: FetchResponse = await this.httpClient.post('/led-strip/animation/start', {body: body});

    if (startResponse.status !== 200) {
      const errorMessage: string = await startResponse.text();

      throw new Error(`Could not start animation: ${errorMessage}`);
    }

    return {finishPromise: this.waitForAnimationToFinish()};
  }

  public async stopAnimation(): Promise<void> {
    const response: FetchResponse = await this.httpClient.delete('/led-strip/animation/stop');

    if (response.status !== 200) {
      const errorMessage: string = await response.text();

      throw new Error(`Could not stop animation: ${errorMessage}`);
    }
  }

  public async waitForAnimationToFinish(): Promise<void> {
    const finishResponse: FetchResponse = await this.httpClient.get('/led-strip/animation/finished');

    if (finishResponse.status !== 200) {
      const errorMessage: string = await finishResponse.text();

      throw new Error(`Could not wait for animation to finish: ${errorMessage}`);
    }
  }
}
