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
    "angular": "github:angular/bower-angular@1.4.3"
  }
});

// System.config({
//   "map": {
//     "app": "./app",
//     "services": "./services",
//     "utils": "./utils",
//     "components": "./components",
//   }
// });

