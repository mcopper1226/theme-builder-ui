import { FC } from 'react';
import styles from './Home.module.scss';

export interface HomeProps {}

export const Home: FC<HomeProps> = (props) => {
  return <div className={styles.example}>A Page</div>;
};
export default Home;
