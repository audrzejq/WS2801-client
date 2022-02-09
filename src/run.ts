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

//Randomise function



//Setting section
var delay = 50;
var led_count = 25;
var flashes = 8;
var dimmer;



  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  const white: LedColor = {
    red: 255,
    green: 255,
    blue: 255,
  };
  const bluewhite: LedColor = {
    red: 180,
    green: 180,
    blue: 255,
  };

  const black: LedColor = {
    red: 0,
    green: 0,
    blue: 0,
  };

  const acidgreen: LedColor = {
    red: 56,
    green: 100,
    blue: 4,
  };

  var lednr;

    function fillCluster(firstLed, lastLed, color, dimmer) {
    for (lednr=firstLed; lednr<(lastLed+1); lednr++){
    client.setLed(lednr, color, dimmer)
    }
  }

 

  async function thunderClap() {
    var i;
    var x = getRandomInt(4, flashes);

    for ( i=0; i < x; i++) {
      if (i==0) {
        dimmer = 100/5;
      }
      else {
        dimmer = 100/(getRandomInt(1,3));
      };
       
        // client.fillLedStrip(white, dimmer);
        var randomCluster = getRandomInt(1, 5);
        

        if (randomCluster == 1) fillCluster(1, 5, white, dimmer);
        else if (randomCluster == 2) fillCluster(6, 10, white, dimmer);
        else if (randomCluster == 3) fillCluster(11, 15, white, dimmer);
        else if (randomCluster == 4) fillCluster(16, 20, white, dimmer);
        else if (randomCluster == 5) fillCluster(21, 25, white, dimmer);

        await sleep(getRandomInt(4,10));
        client.fillLedStrip(black);
          if (i==0) {
            await sleep(150);
          }
          else {
            sleep(50+getRandomInt(0, 100));
          }
    }
  }

  async function acidCloud() {
    var dim;
    console.log("Dimming from 20% to 100%")
    for (dim=20; dim<100; dim+=5) {
      client.fillLedStrip(acidgreen, dim);
      await sleep(30);
    }
    console.log("Dimming from 100% to 20%")
    for (dim=100; dim>20; dim-=5) {
      client.fillLedStrip(acidgreen, dim);
      await sleep(30);
    }
    
    // console.log("Dimming cluster 1 from 10% to 100%")
    // for (dim=10; dim<99;) {
    //   fillCluster(1, 8, acidgreen, dim);
    //   dim = dim + 5;
    //   await sleep(30);
    // } 
    
    // console.log("Dimming cluster 1 from 100% to 10%")
    // for (dim=99; dim>10;){
    //   fillCluster(1, 8, acidgreen, dim);
    //   dim = dim - 5;
    //   await sleep(30);
    // }

  //   for (dim=50; dim<99;) {
  //     await fillCluster(9, 18, acidgreen, dim);
  //     dim = dim +5;
  //   }
  //   for (dim=99; dim>70;) {
  //     await fillCluster(9 ,18, acidgreen, dim);
  //     dim = dim - 5;
  //   }


  //   for (dim=50; dim<99;) {
  //     await fillCluster(18, 25, acidgreen, dim);
  //     dim = dim +5;
  //   }
  //   for (dim=99; dim>50;) {
  //     await fillCluster(18, 25, acidgreen, dim);
  //     dim = dim -5;
  // }  
}

async function run(): Promise<void> {
//   // await register();
//   // await turnLightOn();
//   // var z;
//   // for (z=0; z<30; z++) {
//   // await thunderClap();
//   // await sleep(getRandomInt(5000, 12000));
//   // }
// // }

  var z;
  for (z=0; z<30; z++) {
  await acidCloud();
  
  }
}
run();

