import { FC, useState, useEffect } from 'react';
import { animated } from '@react-spring/web';
import styles from './A11ySwatches.module.scss';
import { Field } from 'formik';
import colorMethods from '../../../utils/color';

export interface A11ySwatchesProps {
  colors: any[];
  rootName: string;
  colorIdx: number;
  rampIdx: number;
  type: 'text' | 'ui';
}

export const A11ySwatches: FC<A11ySwatchesProps> = ({ colors, rootName, colorIdx, rampIdx, type }) => {
  const [loaded, setLoaded] = useState(false);
  console.log(colors);
  const [colorOpts, setColorOpts] = useState<any>([]);
  const [rgb, setRgb] = useState<number[] | boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (colors) {
      //@ts-ignore
      const updated: any[] = [].concat(colors.slice(0, colorIdx), colors.slice(colorIdx + 1));
      setColorOpts(updated);
      setRgb(colors[colorIdx].rgb);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  return (
    <animated.div className={styles.a11ySwatches} style={{ width: '40px' }}>
      {loaded &&
        colorOpts &&
        // @ts-ignore
        colorOpts.map((color, contrastIdx) => {
          return (
            <span className={styles.a11ySwatches__swatch}>
              {type === 'text' ? (
                <>
                  <Field
                    className={styles['formControl__radio--hidden']}
                    type='radio'
                    name={`${rootName}.${rampIdx}.colors.${colorIdx}.contrastText`}
                    value={color.hex}
                    disabled={!colorMethods.contrast(rgb, color.rgb, 4.5)}
                    id={`${rootName}.${rampIdx}.colors.${colorIdx}.contrastText--${contrastIdx}`}
                  />
                  <label
                    htmlFor={`${rootName}.${rampIdx}.colors.${colorIdx}.contrastText--${contrastIdx}`}
                    style={{ color: `hsl(${color.hsl[0]}, ${color.hsl[1]}%, ${color.hsl[2]}%)` }}
                  >
                    Aa
                  </label>
                </>
              ) : (
                <>
                  <Field
                    className={styles['formControl__radio--hidden']}
                    type='radio'
                    name={`${rootName}.${rampIdx}.colors.${colorIdx}.contrastUi`}
                    value={color.hex}
                    disabled={!colorMethods.contrast(rgb, color.rgb, 3)}
                    id={`${rootName}.${rampIdx}.colors.${colorIdx}.contrastUi--${contrastIdx}`}
                  />
                  <label
                    htmlFor={`${rootName}.${rampIdx}.colors.${colorIdx}.contrastUi--${contrastIdx}`}
                    style={{
                      background: `hsl(${color.hsl[0]}, ${color.hsl[1]}%, ${color.hsl[2]}%)`,
                      width: '20px',
                      height: '20px',
                      display: 'block',
                    }}
                  />
                </>
              )}
            </span>
          );
        })}
    </animated.div>
  );
};
export default A11ySwatches;
