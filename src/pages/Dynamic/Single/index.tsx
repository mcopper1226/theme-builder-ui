import { FC } from 'react';
import { useParams } from 'react-router-dom';

export interface SingleProps {}

export const Single: FC<SingleProps> = (props) => {
  const { id } = useParams();
  return <div>Single Page = {id}</div>;
};
export default Single;
