import { FC, useState } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import styles from './ColorRampField.module.scss';
import Swatch from './Swatch';
import { Field, useFormikContext } from 'formik';
import colorMethods from '../../utils/color';

export interface ColorRampFieldProps {
  rootName: string;
  rampIdx: number;
  removeRamp: any;
  addRamp: any;
}

const emptyColor = {
  hex: '#ffffff',
  hsl: [0, 0, 100],
  rgb: [255, 255, 255],
  contrastText: '#000000',
  contrastUi: '#000000',
};

const generateColors = (color: Record<string, any>, callback: any, pos: number) => {
  const hex =
    color.hsl && color.hsl.length === 3 && color.hsl[0] !== 0
      ? colorMethods.hslToHex(color.hsl[0], color.hsl[1], color.hsl[2])
      : color.hex;
  const rgbArrRamp = [].concat(
    // @ts-ignore
    colorMethods.interpolateColors('#ffffff', hex, 7).slice(0, 6),
    colorMethods.interpolateColors(hex, '#000000', 6)
  );
  const formatted = rgbArrRamp.map((rgb) => {
    return {
      hex: colorMethods.rgbArrayToHex(rgb),
      hsl: colorMethods.rgbArrayToHsl(rgb),
      rgb,
      contrastText: '',
      contrastUi: '',
    };
  });
  callback(`colorRamps.${pos}.colors`, formatted);
};

export const ColorRampField: FC<ColorRampFieldProps> = ({ rootName, rampIdx, removeRamp, addRamp }) => {
  const [showTextContrast, setShowTextContrast] = useState(false);
  const [showUiContrast, setShowUiContrast] = useState(false);
  const { values, setFieldValue } = useFormikContext();

  // @ts-ignore
  const rampColors = values[rootName][rampIdx].colors;

  return (
    <div className={styles.ramp}>
      <div className={styles.ramp__actions}>
        <div className={styles.ramp__actions__primary}>
          <label className='formControl__label' htmlFor={`${rootName}.${rampIdx}.name`}>
            Ramp Title
          </label>
          <Field className='formControl__input' name={`${rootName}.${rampIdx}.name`} type='text' />
        </div>
        <div className={styles.ramp__actions__secondary}>
          <ToggleSwitch
            name={`showTextContrast-${rampIdx}`}
            label='Show Text Contrast Colors'
            disabled={rampColors.length < 2}
            onChange={(v) => {
              setShowTextContrast(v);
              setShowUiContrast(false);
            }}
          />
          <ToggleSwitch
            name={`showUiContrast-${rampIdx}`}
            label='Show UI Contrast Colors'
            disabled={rampColors.length < 2}
            onChange={(v) => {
              setShowUiContrast(v);
              setShowTextContrast(false);
            }}
          />
        </div>
      </div>
      <div className={styles.ramp__window}>
        {rampColors &&
          rampColors.map((color: Record<string, any>, colorIdx: number) => (
            <Swatch
              key={colorIdx}
              rootName={rootName}
              rampIdx={rampIdx}
              colorIdx={colorIdx}
              colors={rampColors}
              showTextContrast={showTextContrast}
              showUiContrast={showUiContrast}
              hexDisabled={rampColors.length > 1}
            />
          ))}
      </div>
      <div className={styles.ramp__footer}>
        <button
          className={styles.rampBtn}
          type='button'
          onClick={() =>
            addRamp(rampIdx + 1, {
              name: `Ramp ${rampIdx + 1}`,
              colors: [emptyColor],
            })
          }
        >
          +
        </button>
        <button className={styles.rampBtn} type='button' onClick={() => removeRamp(rampIdx)}>
          -
        </button>
        {rampColors.length === 1 && rampColors[0].hex !== '#ffffff' && (
          <button className={styles.rampBtn} onClick={() => generateColors(rampColors[0], setFieldValue, rampIdx)}>
            Generate Ramp
          </button>
        )}
      </div>
    </div>
  );
};
export default ColorRampField;
