let Gpio = require("onoff").Gpio;

let arr = [0, 17, 18, 27, 22, 23, 24, 5, 6];

const blinkLed = async (ledNo: number) => {
  try {
    let LED = new Gpio(arr[ledNo], "out");

    LED.writeSync(1);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    LED.writeSync(0);
  } catch (e) {
    console.log(e);
  }
};

export const lowLed = async () => {
  arr.map((ea) => {
    let LED = new Gpio(ea, "out");

    LED.writeSync(0);
  });
};

export default blinkLed;
