### Setup Steps MAC

- Install rosetta - 
/usr/sbin/softwareupdate --install-rosetta --agree-to-license

- Change the chip - 
arch -x86_64 zsh

- Install Meteor - 
curl https://install.meteor.com/ | sh  

- meteor npm install npx browserslist@latest --update-db
- meteor npm i
- meteor npm i --save sharp
- meteor npm start

### Setup Steps Linux

- Install Meteor - 
curl https://install.meteor.com/ | sh  

- meteor npm install npx browserslist@latest --update-db
- meteor npm i
- meteor npm i --save sharp
- meteor npm start

### Build Comments

- sudo mkdir /var/www/rocket.chat
- sudo chmod +x /var/www/rocket.chat
- sudo chown -R username /var/www/rocket.chat
- meteor build --server-only --directory /var/www/rocket.chat