const tinycolor = require('./tinycolor');

const colorMix = function(color, index, mix = true){
  const darkestL = 8;
  const midL = 24;
  const lightL = 56;
  const darkStep = 2;
  const midStep = 4;
  const lightStep = 20;
  let grayL;
  if(index <= 9 ){
    grayL = (darkestL + darkStep * (index - 1)) / 100; 
  }else if(index > 9 && index <= 12){
    grayL = (midL + midStep * (index - 9)) / 100;
  }else if(index > 12){
    grayL = (lightL + lightStep * (index - 13)) / 100;
  }

  const curGray = tinycolor({
    h: 0,
    s: 0,
    l: grayL
  }).toHexString();

  if(index >= 12 || !mix){
    return curGray;
  }else{
    const mixColor = tinycolor.mix(color, curGray, 96).toHexString();
    return mixColor;
  }
};


const colorPalette = function(color, index) {
  const darkestL = 16;
  const lightestL = 96;
  const hsl = tinycolor(color).toHsl();
  const curLight = hsl.l * 100;

  let light;
  const darkStep = Math.max((curLight - darkestL) / 5, 0);
  const lightStep = Math.max((lightestL - curLight) /5, 0);
  if(index === 6){
    light = hsl.l;
  }else if(index < 6){
    light = (curLight + (6 - index)*lightStep)/100;
  }else if(index > 6){
    light = (curLight - (index - 6)*darkStep)/100;
  }

  return tinycolor({
    h: Math.round(hsl.h),
    s: hsl.s,
    l: light
  }).toHexString();
}

function mixGray(color, gray) {
  return tinycolor.mix(color, curGray, 96)
}

exports.colorMix = colorMix;
exports.colorPalette = colorPalette;
exports.mixGray = mixGray;
