System.config({
  "baseURL": "src",
  "defaultJSExtensions": true,
  "transpiler": "none",
  "paths": {
    "github:*": "jspm_packages/github/*"
  }
});

System.config({
  "map": {
    "lib": "src/",
    "angular": "github:angular/bower-angular@1.4.3"
  }
});

