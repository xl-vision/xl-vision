const fs = require('fs-extra');

run();

async function run() {
  const glob = await import('glob');

  return glob
    .glob('+(packages|platforms)/*/+(modern|legacy|dist|.next)', {
      cwd: process.cwd(),
      dot: true,
    })
    .then((matches) => {
      let p2 = Promise.resolve();
      matches.forEach((it) => {
        p2 = p2.then(() => fs.remove(it));
      });
      return p2;
    });
}
