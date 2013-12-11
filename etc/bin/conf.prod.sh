cp etc/env/prod.js public/js/env.js
node build/build.js
cp build/scripts.min.js public/js/all.js
