import Immutable from 'immutable';
import Cycle from 'cyclejs';
let h = Cycle.h;

let isTruthy = (style) => (!!style);

function mergeStyles(...styleObjects) {
  return styleObjects.filter(isTruthy).reduce((styleA, styleB) => {
    let mapA = Immutable.Map(styleA);
    let mapB = Immutable.Map(styleB);
    return mapA.merge(mapB).toObject(); // notice B first
  }, {});
}

const elevation1Style = {
  '-webkit-box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)',
     '-moz-box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)',
          'box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)'
};

const elevation2Style = {
  position: 'relative'
};

function getElevationPseudoElementStyle(dy, blur, opacity) {
  return {
    display: 'block',
    position: 'absolute',
    left: '0', top: '0', right: '0', bottom: '0',
    '-webkit-box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
       '-moz-box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
            'box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`
  };
}

const elevation2Before = h('div', {style:
  getElevationPseudoElementStyle('2px', '10px', '0.17')
}, '');
const elevation2After = h('div', {style:
  getElevationPseudoElementStyle('2px', '5px', '0.26')
}, '');

const elevation3Before = h('div', {style:
  getElevationPseudoElementStyle('6px', '20px', '0.19')
}, '');
const elevation3After = h('div', {style:
  getElevationPseudoElementStyle('6px', '17px', '0.2')
}, '');

const svgElevation1Style = {
  '-webkit-filter': 'drop-shadow(0px 3px 2px rgba(0,0,0,0.26))',
          'filter': 'drop-shadow(0px 3px 2px rgba(0,0,0,0.26))'
};

const textUnselectable = {
  '-webkit-user-select': 'none',
   '-khtml-user-select': 'none',
     '-moz-user-select': '-moz-none',
       '-o-user-select': 'none',
          'user-select': 'none'
};

export default {
  mergeStyles,
  elevation1Style,
  elevation2Style,
  elevation2Before,
  elevation2After,
  elevation3Before,
  elevation3After,
  svgElevation1Style,
  textUnselectable
};
