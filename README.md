RxMarbles
=========

A webapp for experimenting with diagrams of [Rx](http://reactive-extensions.github.io/RxJS/) Observables, for learning purposes.

![Example merge](https://raw.githubusercontent.com/staltz/rxmarbles/master/dist/img/example_merge.png)

## Implementation

The source code is written in [CoffeeScript](http://coffeescript.org/). The architecture is a simple MVC heavily dependent on RxJS. Some parts of the views render to the DOM using pure JavaScript APIs for DOM manipulation, some other parts use [virtual-dom](https://github.com/Matt-Esch/virtual-dom/) for optimizing performance.

## Contributing

Fork and git clone the repository.

```
npm install
```

The build system is gulp. To develop, run in watch mode using the default task:

```
gulp
```

And access the site on your local machine as `file:///path/to/rxmarblesrepo/index.html`.

To build the project with no watch mode, run the task `gulp dev-build`.

Make a [pull request](https://github.com/staltz/rxmarbles/pulls) when you're ready.