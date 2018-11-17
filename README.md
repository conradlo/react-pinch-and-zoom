
![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)

# React Pinch and Zoom
A react container component with pinch-to-zoom gesture interaction.
<!-- ![header img](/static/demo_header.gif) -->
<p align="center">
  <img src="/static/demo_header.gif">
</p>

## Getting Started

<!-- TODO: -->
<!-- ### Prerequisites -->

### Installing

1. Install this package as dependency

    ```shell
    # pwd: ~/project/dir
    $ npm install react-pinch-and-zoom
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

```shell
./react-pinch-and-zoom (master)
├── docs               // compiled github demo page
├── lib                // compiled react component in commonjs module (git ignored)
├── package.json
├── server.js          // config local development server
└── src
    ├── PinchToZoom    // source code of react-pinch-and-zoom
    └── demo           // source code of github demo page
```

## Develop on local machine

1. Pull this repository
    ```shell
    # pwd: ~/development/dir
    $ git pull https://github.com/conradlo/react-pinch-and-zoom.git
    ```
1. Install dependency
    ```shell
    $ cd react-pinch-and-zoom
    # pwd: ~/development/dir/react-pinch-and-zoom
    $ npm install
    ```
1. Start local development server
    ```shell
    # pwd: ~/development/dir/react-pinch-and-zoom
    $ npm start
    ```
2. Visit `localhost:3000` and edit `src/PinchToZoom/*`
3. Consult `package.json` for more npm script tasks

## Production build

run `npm run build` will:

1. transpile the component's source code `/lib`
2. build and bundle the Github page `/docs`

```shell
# pwd: ~/development/dir/react-pinch-and-zoom
$ npm run build
```

## Built With

* [Reactjs](https://reactjs.org/) - A JavaScript library for building user interfaces
* [Sass](https://sass-lang.com/) - Syntactically Awesome Style Sheets
* [Webpack](https://webpack.js.org/) - JavaScript module bundler
* [Babel](http://babeljs.io/) - JavaScript transpiler/compiler
* [Typescript](https://www.typescriptlang.org/) - For extra type safety
* [eslint](https://eslint.org/), [tslint](https://palantir.github.io/tslint/), [prettier](https://prettier.io/), [vscode](https://code.visualstudio.com/)

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/conradlo/react-pinch-and-zoom/blob/master/CONTRIBUTING.md) for details on code of conduct, and the process for submitting pull requests.

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/conradlo/react-pinch-and-zoom/tags). 

## License

see the [LICENSE](https://github.com/conradlo/react-pinch-and-zoom/blob/master/LICENSE) file for details

## Acknowledgments

* https://gist.github.com/PurpleBooth/109311bb0361f32d87a2