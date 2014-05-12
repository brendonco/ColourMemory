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

#Demo

As soon as your environment is set up you can see colour memory by:

* pointing your favourite browser to http://127.0.0.1/colourmemory/index.html
