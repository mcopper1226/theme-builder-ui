import { FC } from 'react';
import styles from './ToggleSwitch.module.scss';
import cx from 'classnames';

export interface ToggleSwitchProps {
  onChange: (value: boolean) => void;
  name: string;
  label: string;
  disabled: boolean;
}

export const ToggleSwitch: FC<ToggleSwitchProps> = ({ name, onChange, label, disabled }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };
  return (
    <div className={cx(styles.toggleSwitch, { [styles['toggleSwitch--disabled']]: disabled })}>
      <input
        type='checkbox'
        disabled={disabled}
        className={styles.toggleSwitch__input}
        name={name}
        id={name}
        onChange={handleChange}
      />
      <label className={styles.toggleSwitch__label} htmlFor={name}>
        {label}
        <span className={styles.toggleSwitch__track} />
        <span className={styles.toggleSwitch__thumb} />
      </label>
    </div>
  );
};
export default ToggleSwitch;
