const { colorMix, colorPalette } = require('./util');

const grayScaleLimit = 11;

let presetPrimaryColors = {
  blue: '#338AFF',
  green: '#6ABF40',
  red: '#F65656',
  yellow: '#FFA900',
  cyan: '#10D5D5'
};
let presetPalettes = {};

// 生成色阶
function generate(color){
  const colors = [];
  for (let i = 0; i < 11; i++) {
    colors.push(i === 5 ? color : colorPalette(color, i + 1))
  }
  return colors;
}

// 生成预设值
function generatePreset(){  
  // 彩色
  Object.keys(presetPrimaryColors).forEach((key) => {
    presetPalettes[key]= generate(presetPrimaryColors[key])
  });
  
  // 浅灰色
  presetPalettes['light-gray'] = [
    '#FFFFFF',
    '#FAFAFA',
    '#F5F5F5',
    '#F0F0F0',
    '#EBEBEB',
    '#E0E0E0',
    '#D6D6D6',
    '#C1C1C1',
    '#999999',
    '#666666',
    '#333333',
  ];

  // 深灰色
  presetPalettes['dark-gray'] = [];
  for(let j = 1; j <= grayScaleLimit; j++) {
    let colorValue = colorMix(presetPrimaryColors['blue'], j);
    presetPalettes['dark-gray'].unshift(colorValue)
  }

  // 深灰色-原色
  presetPalettes['dark-gray-origin'] = [];
  for(let j = 1; j <= grayScaleLimit; j++) {
    let colorValue = colorMix(presetPrimaryColors['blue'], j, false);
    presetPalettes['dark-gray-origin'].unshift(colorValue)
  }
}

generatePreset();

// 输出colorMap对象
module.exports =  { generate, presetPalettes };