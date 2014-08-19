RxMarbles
=========

A webapp for experimenting with diagrams of [Rx](http://reactive-extensions.github.io/RxJS/) Observables, for learning purposes.

![Example merge](https://raw.githubusercontent.com/staltz/rxmarbles/master/dist/img/example_merge.png)

#### Features:

- Visualize example diagrams for each operator in Rx
- Drag an item ("marble") on an Observable to see how the operator reacts
- Direct link to any example diagram, e.g., http://rxmarbles.com/#delay

## Implementation

The source code is written in [CoffeeScript](http://coffeescript.org/). The architecture is a simple MVC heavily dependent on RxJS. Some parts of the views render to the DOM using pure JavaScript APIs for DOM manipulation, some other parts use [virtual-dom](https://github.com/Matt-Esch/virtual-dom/) for optimizing performance.

## Contributing

Fork and git clone the repository.

```
npm install
```

The roadmap is entirely specified in the [TODO](https://github.com/staltz/rxmarbles/blob/master/TODO) file, which follows the [git-done](https://github.com/staltz/git-done) syntax. You can also use `git done` instead of `git commit` if you wish. For minor bug fixes, you won't need to deal with the TODO file. But if you're building a feature, remember to write a `DONE` entry before you commit and send the pull request.

The build system is [gulp](http://gulpjs.com/). To develop, run in watch mode using the default task:

```
gulp
```

And access the site on your local machine as `file:///path/to/rxmarblesrepo/index.html`.

To build the project with no watch mode, run the task `gulp dev-build` (development) or `gulp build` (production).

Make a [pull request](https://github.com/staltz/rxmarbles/pulls) when you're ready.
