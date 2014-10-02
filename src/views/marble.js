/*
 * Renders a circle or similar shape to represent an emitted item on a stream.
 */
var Rx = require('rx');
var Utils = require('rxmarbles/views/utils');
var vh = require('virtual-hyperscript');
var svg = require('virtual-hyperscript/svg');

var XMLNS = "http://www.w3.org/2000/svg";
var NUM_COLORS = 4;
var SVG_VIEWBOX = "0 0 1 1";
var SVG_CX = 0.5;
var SVG_CY = 0.5;
var SVG_R = 0.47;
var SVG_BORDER_WIDTH = "0.06px";

function createRootElement(draggable) {
  var container = document.createElement("div");
  container.className = "marble js-marble";
  if (draggable) {
    container.className += " is-draggable";
  }
  return container;
};

function createMarbleSvg(item) {
  var colornum = (item.id % NUM_COLORS) + 1;
  var marble = document.createElementNS(XMLNS, "svg");
  marble.setAttribute("class", "marble-inner");
  marble.setAttribute("viewBox", SVG_VIEWBOX);
  var circle = document.createElementNS(XMLNS, "circle");
  circle.setAttribute("cx", SVG_CX);
  circle.setAttribute("cy", SVG_CY);
  circle.setAttribute("r", SVG_R);
  circle.setAttribute("class", "marble-shape marble-shape--color" + colornum);
  circle.setAttribute("stroke-width", SVG_BORDER_WIDTH);
  marble.appendChild(circle);
  return marble;
};

function createContentElement(item) {
  var content = document.createElement("p");
  content.className = "marble-content";
  content.textContent = (item != null) ? item.content : "";
  return content;
};

function getLeftPosStream(item, draggable, element) {
  if (draggable) {
    return Utils.getInteractiveLeftPosStream(element, item.time);
  } else {
    return Rx.Observable.just(item.time);
  }
};

function render(item, draggable) {
  if (draggable == null) {
    draggable = false;
  }
  // Create DOM elements
  var marble = createRootElement(draggable);
  marble.appendChild(createMarbleSvg(item));
  marble.appendChild(createContentElement(item));
  // Define public and private streams
  var leftPosStream = getLeftPosStream(item, draggable, marble);
  marble.dataStream = leftPosStream
    .map(function(leftPos) {
      return {time: leftPos, content: item.content, id: item.id};
    });
  leftPosStream
    .subscribe(function(leftPos) {
      marble.style.left = leftPos + "%";
    });
  return marble;
};

function virtualRender(marbleData) {
  var colornum = (marbleData.id % 4) + 1;
  var leftPos = "" + marbleData.time + "%";
  var content = "" + marbleData.content;
  return vh("div.marble.js-marble", {style: {"left": leftPos}}, [
    svg("svg", {attributes: {"class": "marble-inner", viewBox: SVG_VIEWBOX}}, [
      svg("circle", {
        attributes: {
          "class": "marble-shape marble-shape--color" + colornum,
          cx: SVG_CX, cy: SVG_CY, r: SVG_R,
          "stroke-width": SVG_BORDER_WIDTH
        }
      })
    ]),
    vh("p.marble-content", {}, content)
  ]);
};

module.exports = {
  render: render,
  virtualRender: virtualRender
};
