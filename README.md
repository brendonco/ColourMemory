#Installation

Before proceeding with the instructions below make sure that you've got node.js (version 0.10.x) installed for your operating system: http://nodejs.org/download/. When you've got node.js and npm (comes with the node.js installation) set up npm dependencies of this project:

```
* npm install -g grunt-cli-
* npm install
* test your setup by running grunt
```

#Dependency

````
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-copy --save-dev
npm install grunt-contrib-clean --save-dev
npm install grunt-contrib-concat --save-dev
````

#Build using Grunt
* Starting a build using grunt

#Deploy to Web Server e.g. Apache Tomcat

````
copy dist/www/* to apache-tomcat-xxx\webapps\colourmemory\
````

#PHP installation
Refer to PHP website on how to install

http://sg3.php.net/manual/en/install.php

#MySQL installation
Refer to MySQL website on how to install

http://dev.mysql.com/doc/refman/5.7/en/installing.html

#Demo

As soon as your environment is set up you can see colour memory by:

* pointing your favourite browser to http://127.0.0.1/colourmemory/index.html
