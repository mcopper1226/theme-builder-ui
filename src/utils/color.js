const colorMethods = {
  randomHex() {
    return '#' + ('00' + Math.floor(Math.random() * 16777216).toString(16)).substr(-6);
  },
  hexArray(hex) {
    return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  },
  rgbObjectFromHex(hex) {
    var result = this.hexArray(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },
  rgbArrayFromHex(hex) {
    const rgb = this.rgbObjectFromHex(hex);
    return [rgb.r, rgb.g, rgb.b];
  },
  hslObjectFromHex(hex) {
    const hsl = {};
    const rgb = this.rgbObjectFromHex(hex);

    // eslint-disable-next-line no-unused-expressions, no-sequences
    (rgb.r /= 255), (rgb.g /= 255), (rgb.b /= 255);
    let max = Math.max(rgb.r, rgb.g, rgb.b);
    let min = Math.min(rgb.r, rgb.g, rgb.b);

    hsl.l = (max + min) / 2;

    if (max === min) {
      hsl.h = hsl.s = 0; // achromatic
    } else {
      let d = max - min;

      hsl.s = hsl.l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case rgb.r:
          hsl.h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
          break;
        case rgb.g:
          hsl.h = (rgb.b - rgb.r) / d + 2;
          break;
        case rgb.b:
          hsl.h = (rgb.r - rgb.g) / d + 4;
          break;
        default:
          break;
      }

      hsl.h /= 6;
    }

    return {
      h: Math.round(hsl.h * 360),
      s: Math.round(hsl.s * 100),
      l: Math.round(hsl.l * 100),
    };
  },
  hslArrayFromHex(hex) {
    const hsl = this.hslObjectFromHex(hex);
    return [hsl.h, hsl.s, hsl.l];
  },
  hexToRgb(hex) {
    const rgb = this.rgbObjectFromHex(hex);
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  },
  hexToHsl(hex) {
    const hsl = this.hslObjectFromHex(hex);
    return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
  },
  rgbChannelToHex(channel) {
    const hex = channel.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  },
  rgbToHex(r, g, b) {
    return `#${this.rgbChannelToHex(r)}${this.rgbChannelToHex(g)}${this.rgbChannelToHex(b)}`;
  },
  rgbArrayToHex(color) {
    return this.rgbToHex(color[0], color[1], color[2]);
  },
  rgbArrayToHsl(color) {
    return this.hslArrayFromHex(this.rgbArrayToHex(color));
  },
  hslToRgbObject(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return {
      r,
      g,
      b,
    };
  },
  hslToRgb(h, s, l) {
    const rgb = this.hslToRgbObject(h, s, l);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  },
  hslToHex(h, s, l) {
    const rgb = this.hslToRgbObject(h, s, l);
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  },
  brightness(hex) {
    const rgb = this.rgbObjectFromHex(hex);
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  },
  foregroundAdjust(hex, test, lightHex, darkHex) {
    test = test || 154;
    lightHex = lightHex || '#fff';
    darkHex = darkHex || '#000';
    return this.brightness(hex) < test ? lightHex : darkHex;
  },
  interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) {
      factor = 0.5;
    }
    const result = color1.slice();

    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  },
  interpolateColors(color1, color2, steps) {
    let stepFactor = 1 / (steps - 1);
    let interpolatedColorArray = [];

    color1 = this.rgbArrayFromHex(color1).map(Number);
    color2 = this.rgbArrayFromHex(color2).map(Number);

    for (var i = 0; i < steps; i++) {
      interpolatedColorArray.push(this.interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
  },
  luminance(r, g, b) {
    let [lumR, lumG, lumB] = [r, g, b].map((component) => {
      let proportion = component / 255;

      return proportion <= 0.03928 ? proportion / 12.92 : Math.pow((proportion + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
  },
  contrastRatio(luminance1, luminance2) {
    let lighterLum = Math.max(luminance1, luminance2);
    let darkerLum = Math.min(luminance1, luminance2);

    return (lighterLum + 0.05) / (darkerLum + 0.05);
  },
  contrast(color1, color2, ratio) {
    const luminance1 = this.luminance(...color1);
    const luminance2 = this.luminance(...color2);
    const cR = this.contrastRatio(luminance1, luminance2);
    return ratio ? cR >= ratio : cR;
  },
};

export default colorMethods;
