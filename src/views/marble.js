/*
 * Renders a circle or similar shape to represent an emitted item on a stream.
 */
var h = require('virtual-hyperscript');
var svg = require('virtual-hyperscript/svg');

var NUM_COLORS = 4;

function vrender(marbleData, isDraggable, mouseDown$) {
  if (typeof isDraggable === 'undefined') {
    isDraggable = false;
  }
  var colornum = (marbleData.id % NUM_COLORS) + 1;
  var leftPos = '' + marbleData.time + '%';
  var content = '' + marbleData.content;
  return h('div.marble.js-marble'+(isDraggable ? '.is-draggable' :''), {
    style: {'left': leftPos},
    attributes: {
      'data-marble-id': marbleData.id,
      'data-diagram-id': marbleData.diagramId
    },
    'ev-mousedown': function(ev) {
      if (mouseDown$) {
        mouseDown$.onNext(ev);
      }
    }
  },[
    svg('svg', {attributes: {'class': 'marble-inner', viewBox: '0 0 1 1'}}, [
      svg('circle', {
        attributes: {
          'class': 'marble-shape marble-shape--color' + colornum,
          cx: 0.5, cy: 0.5, r: 0.47,
          'stroke-width': '0.06px'
        }
      })
    ]),
    h('p.marble-content', {}, content)
  ]);
}

module.exports = {
  vrender: vrender
};
