import React, { useContext } from 'react'
import DataContext from '../../context/DataContext';

const Home = () => {
  const { loginUserName } = useContext(DataContext);

  return (
    <div>{`Welcome ${loginUserName}`}</div>
  )
}

export default Home