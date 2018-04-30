
![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)

# React Pinch and Zoom

A react container component with iOS UIScrollView's alike pinch-to-zoom gesture interaction.

## Getting Started

<!-- TODO: -->

<!-- ### Prerequisites -->

### Installing

1. Install this package as dependency (e.g. via npm)

    ```sh
    [~/project/dir] $ npm install react-pinch-and-zoom
    ```

1. Import the component

    ```jsx
    import PinchToZoom from 'react-pinch-and-zoom';
    ```
1. Wrap the pinch-able component inside `PinchToZoom` component

    ```jsx
    render() {
      return (
        <div className="outer-container">
          <PinchToZoom
            boundSize={{ width: baseScreenWidth, height: baseHeight }}
            contentSize={{ width: contentSize.w, height: contentSize.h }}
          > 
            { this.props.children } 
          </PinchToZoom>
        </div>
      );
    }
    ```

## Running the tests

```sh
[~/project/dir] $ npm test
```

## Project structure

```
.
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── lib                // git ignored
├── node_modules       // git ignored
├── package-lock.json
├── package.json
└── src                // source code
    ├── demo
    └── lib
```

## Built With

* [Reactjs](https://reactjs.org/) - A JavaScript library for building user interfaces
* [Sass](https://sass-lang.com/) - Syntactically Awesome Style Sheets
* [Webpack](https://webpack.js.org/) - JavaScript module bundler
* [Babel](http://babeljs.io/) - JavaScript transplier/compiler

## Contributing

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for details on code of conduct, and the process for submitting pull requests.

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/conradlo/react-pinch-and-zoom/tags). 

## License

see the [LICENSE](LICENSE) file for details

## Acknowledgments

* https://github.com/markusenglund/react-npm-component-starter
* https://gist.github.com/PurpleBooth/109311bb0361f32d87a2

> "If your're not embarrassed by the first version of rour product, you’ve launched too late" - Reid Hoffman, founder of LinkedIn