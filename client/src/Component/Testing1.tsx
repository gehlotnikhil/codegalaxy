import React,{useState} from 'react'
import Sidebar from './Slidebar';
import Content from './Content';

function Testing1() {
    const [selectedOption, setSelectedOption] = useState<string>("General");

    const handleOptionChange = (option: string) => {
      setSelectedOption(option);
    };
  return (
    <>
      <Sidebar onOptionChange={handleOptionChange} />
      <Content selectedOption={selectedOption} />
    </>
  )
}

export default Testing1