`work in progress <2018-04-30>`

# React Pinch and Zoom

A react container component with iOS UIScrollView's alike pinch-to-zoom gesture interaction.

## Getting Started

TODO:

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

## Deployment

TODO:

## Built With

* [Reactjs](https://reactjs.org/) - A JavaScript library for building user interfaces
* [Sass](https://sass-lang.com/) - Syntactically Awesome Style Sheets
* [Webpack](https://webpack.js.org/) - JavaScript module bundler

## Contributing

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for details on code of conduct, and the process for submitting pull requests.

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/conradlo/react-pinch-and-zoom/tags). 

## License

see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

TODO:

> "If your're not embarrassed by the first version of rour product, you’ve launched too late" - Reid Hoffman, founder of LinkedIn