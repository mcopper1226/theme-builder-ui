import { FC } from 'react';
import { useSpring, animated } from '@react-spring/web';
import styles from './A11ySwatches.module.scss';
import { useFormikContext, Field } from 'formik';
import colorMethods from '../../../utils/color';

export interface A11ySwatchesProps {
  colors: any[];
  rootName: string;
  colorIdx: number;
  rampIdx: number;
  type: 'text' | 'ui';
}

export const A11ySwatches: FC<A11ySwatchesProps> = ({ colors, rootName, colorIdx, rampIdx, type }) => {
  // @ts-ignore
  const colorOpts: any[] = [].concat(colors.slice(0, colorIdx), colors.slice(colorIdx + 1));
  const rgb = colors[colorIdx].rgb;

  return (
    <animated.div className={styles.a11ySwatches} style={{ width: '40px' }}>
      {colorOpts &&
        colorOpts.map((color, contrastIdx) => (
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
        ))}
    </animated.div>
  );
};
export default A11ySwatches;
