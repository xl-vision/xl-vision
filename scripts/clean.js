const fs = require('fs-extra');
const glob = require('glob');

run();

function run() {
  const p = new Promise((resolve, reject) => {
    glob(
      '+(packages|platforms)/*/+(modern|legacy|dist|.next)',
      {
        cwd: process.cwd(),
        dot: true,
      },
      (err, matches) => {
        if (err) {
          return reject(err);
        }
        resolve(matches);
      },
    );
  });

  p.then((matches) => {
    let p2 = Promise.resolve();
    matches.forEach((it) => {
      p2 = p2.then(() => fs.remove(it));
    });
    return p2;
  });
}
