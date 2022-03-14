import { FC } from 'react';
import { useParams } from 'react-router-dom';
import ColorRampField from '../../../components/ColorRampField';
import { Formik, Form, FieldArray, Field } from 'formik';
import colorMethods from '../../../utils/color';

export interface SingleProps {}

export const Single: FC<SingleProps> = (props) => {
  const { id } = useParams();
  return (
    <div>
      <h1>Color Ramps</h1>
      <Formik
        initialValues={{
          colorRamps: [
            {
              name: 'Palette 0',
              colors: [
                {
                  hex: '#ffffff',
                  contrastText: '',
                  contrastUi: '',
                  hsl: [0, 0, 100],
                  rgb: [255, 255, 255],
                },
              ],
            },
          ],
        }}
        onSubmit={(values) => console.log(values)}
        render={({ values }) => (
          <Form>
            <FieldArray
              name='colorRamps'
              render={(arrayHelpers) => (
                <div>
                  {values.colorRamps &&
                    values.colorRamps.length > 0 &&
                    values.colorRamps.map((ramp, index) => (
                      <>
                        <ColorRampField
                          rootName='colorRamps'
                          removeRamp={(i: number) => arrayHelpers.remove(i)}
                          addRamp={arrayHelpers.insert}
                          rampIdx={index}
                        />
                      </>
                    ))}
                </div>
              )}
            />
          </Form>
        )}
      />
    </div>
  );
};
export default Single;
