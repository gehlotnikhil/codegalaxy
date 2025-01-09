import React,{useContext, useEffect, useState} from 'react'
import Sidebar from './Slidebar';
import Content from './Content';
import { useNavigate } from 'react-router';
import MainContext from '../context/main';

function Testing1() {
  const navigate = useNavigate()
  const context = useContext(MainContext);
  const {EntireUserDetail,fetchUserDetailFromLocalStorage} = context;
  useEffect(() => {
    if(EntireUserDetail.token === null){
      const success = fetchUserDetailFromLocalStorage("fetchFromLocal",{})
      if(!success){
        navigate("/login")
      }
}})
  
    
  
  return (
    <>
      <>
      <h1>Hi</h1>
      </>
    </>
  )
}

export default Testing1