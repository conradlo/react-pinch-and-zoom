
![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)

# React Pinch and Zoom

A react container component with pinch-to-zoom gesture interaction.

## Getting Started

<!-- TODO: -->

<!-- // TODO: es6 module,  -->
<!-- // TODO: demo image/gif/video etc,  -->
<!-- ### Prerequisites -->

### Installing

1. Install this package as dependency

    ```fish
    [~/project/dir] $ npm install react-pinch-and-zoom
    ```

2. Import the component

    ```jsx
    import PinchToZoom from 'react-pinch-and-zoom';
    ```
3. Wrap the pinch-able component inside `PinchToZoom` component

    ```jsx
    render() {
      return (
        <div className="container">
          <PinchToZoom>
            <img src={...}/> // child node should have intrinsic size
          </PinchToZoom>
        </div>
      );
    }
    ```

## Project structure

```fish
./react-pinch-and-zoom (master)
├── docs               // compiled github demo page
├── lib                // compiled react component *in es6 module* (git ignored)
├── package.json
├── server.js          // config local development server
└── src
    ├── PinchToZoom    // source code of react-pinch-and-zoom
    └── demo           // source code of github demo page
```

## Develop on local machine

1. Pull this repository
    ```shell
    [~/development] $ git pull https://github.com/conradlo/react-pinch-and-zoom.git
    ```
1. Install dependency
    ```shell
    [~/development] $ cd react-pinch-and-zoom
    [~/development/react-pinch-and-zoom] $ npm install
    ```
1. Start local development server
    ```shell
    [~/development/react-pinch-and-zoom] $ npm run dev
    ```
1. Visit `localhost:3000` and edit `src/PinchToZoom/index.js`

## Production build

run `npm run build` will:

1. transpile the component's source code `/lib`
1. build and bundle the Github page `/docs`

```shell
[~/development/react-pinch-and-zoom] $ npm run build
```

## Built With

* [Reactjs](https://reactjs.org/) - A JavaScript library for building user interfaces
* [Sass](https://sass-lang.com/) - Syntactically Awesome Style Sheets
* [Webpack](https://webpack.js.org/) - JavaScript module bundler
* [Babel](http://babeljs.io/) - JavaScript transpiler/compiler
<!-- * typescript, eslint, tslint, prettier -->

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/conradlo/react-pinch-and-zoom/blob/master/CONTRIBUTING.md) for details on code of conduct, and the process for submitting pull requests.

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/conradlo/react-pinch-and-zoom/tags). 

## License

see the [LICENSE](https://github.com/conradlo/react-pinch-and-zoom/blob/master/LICENSE) file for details

## Acknowledgments

* https://gist.github.com/PurpleBooth/109311bb0361f32d87a2