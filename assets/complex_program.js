function delay(miliseconds = 1000) {
  return new Promise((r) => {
    setTimeout(() => {
      r();
    }, miliseconds);
  });
}

async function timeLog() {}

function main(interval = 1000) {
  let counter = 0;
  setInterval(() => {
    counter++;
    if (counter % 10 === 0) {
      return console.log(new Error("Random error"));
    }
    console.log(counter, new Date());
  }, interval);
}

main();
