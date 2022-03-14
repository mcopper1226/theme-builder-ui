import { FC, useEffect, useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import cx from 'classnames';
import styles from './Swatch.module.scss';
import A11ySwatches from '../A11ySwatches';
import { useFormikContext, Field } from 'formik';
import colorMethods from '../../../utils/color';

export interface SwatchProps {
  showTextContrast: boolean;
  showUiContrast: boolean;
  colors: any[];
  rootName: string;
  rampIdx: number;
  colorIdx: number;
}

interface SwatchFormProps {
  rootName: string;
  rampIdx: number;
  colorIdx: number;
}

const SwatchForm: FC<SwatchFormProps> = ({ rootName, rampIdx, colorIdx }) => {
  const { values, setFieldValue } = useFormikContext();
  const [isLoaded, setIsLoaded] = useState(false);

  // @ts-ignore
  const hsl = values[rootName][rampIdx].colors[colorIdx].hsl;

  // @ts-ignore
  const hex = values[rootName][rampIdx].colors[colorIdx].hex;

  useEffect(() => {
    if (isLoaded) {
      setFieldValue(`${rootName}.${rampIdx}.colors.${colorIdx}.hex`, colorMethods.hslToHex(...hsl));
    }
  }, [hsl]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <div className='formControl'>
        <label className='formControl__label'>Hex</label>
        <Field className='formControl__input' type='text' name={`${rootName}.${rampIdx}.colors.${colorIdx}.hex`} />
      </div>
      <div className='formControl'>
        <label className='formControl__label'>HSL</label>
        <div className='formControl__flex'>
          <div className='formControl__flexItem'>
            <Field
              className='formControl__input'
              type='number'
              name={`${rootName}.${rampIdx}.colors.${colorIdx}.hsl[0]`}
            />
            <span className='formControl__sublabel'>Hue</span>
          </div>
          <div className='formControl__flexItem'>
            <Field
              className='formControl__input'
              type='number'
              name={`${rootName}.${rampIdx}.colors.${colorIdx}.hsl[1]`}
            />
            <span className='formControl__sublabel'>Sat.</span>
          </div>
          <div className='formControl__flexItem'>
            <Field
              className='formControl__input'
              type='number'
              name={`${rootName}.${rampIdx}.colors.${colorIdx}.hsl[2]`}
            />
            <span className='formControl__sublabel'>Light.</span>
          </div>
        </div>
      </div>
    </>
  );
};

export const Swatch: FC<SwatchProps> = ({
  showTextContrast = false,
  showUiContrast = false,
  colors,
  rootName,
  colorIdx,
  rampIdx,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formColor, setFormColor] = useState('#000000');

  function toggleOpen() {
    setIsOpen(!isOpen);
  }

  const colorsRef = useRef<any[]>([]);

  useEffect(() => {
    // @ts-ignore
    colorsRef.current = [].concat(colors);
  }, [colors]);

  useEffect(() => {
    setIsLoaded(true);
    if (colors && colorMethods.contrast(colors[colorIdx].rgb, [255, 255, 255], 4.5)) {
      setFormColor('#ffffff');
    }
  }, []);

  const { swatchWidth, formWidth, opacity } = useSpring({
    swatchWidth: isOpen ? '240px' : '40px',
    formWidth: isOpen ? (showTextContrast ? '180px' : '180px') : '0px',
    opacity: isOpen ? 1 : 0,
  });

  return (
    <div>
      <h4 className={styles.name}>
        {colorIdx > 0 && colorIdx < colors.length - 1 ? `${colorIdx}0` : colorIdx === 0 ? 'white' : 'black'}
      </h4>
      <div className={cx(styles.swatch, { [styles['swatch--light']]: formColor === '#ffffff' })}>
        {isLoaded && (
          <>
            <div className={styles.swatch__clickZone} onClick={toggleOpen} />
            <animated.div
              className={styles.swatch__colorZone}
              // @ts-ignore
              style={{
                width: swatchWidth,
                background: `hsl(${colorsRef?.current?.[colorIdx]?.hsl[0]}, ${colorsRef?.current?.[colorIdx]?.hsl[1]}%, ${colorsRef?.current?.[colorIdx]?.hsl[2]}%)`,
              }}
            >
              <animated.div className={styles.form} style={{ width: formWidth, opacity: opacity }}>
                <div className={styles.form__inner}>
                  <SwatchForm rootName={rootName} rampIdx={rampIdx} colorIdx={colorIdx} />
                </div>
              </animated.div>

              {showUiContrast && (
                <A11ySwatches
                  type='ui'
                  colors={colorsRef?.current}
                  rootName={rootName}
                  rampIdx={rampIdx}
                  colorIdx={colorIdx}
                />
              )}
              {showTextContrast && (
                <A11ySwatches
                  type='text'
                  colors={colorsRef?.current}
                  rootName={rootName}
                  rampIdx={rampIdx}
                  colorIdx={colorIdx}
                />
              )}
            </animated.div>
          </>
        )}
      </div>
    </div>
  );
};
export default Swatch;
