import {createContext} from "react"

interface MainContextType {
    Demo?: string; // Replace 'any' with the appropriate type
    setDemo?: React.Dispatch<React.SetStateAction<string>>;
    ChangeCodeEditorDesign?:Function;
  }
const MainContext = createContext<MainContextType>({})

export default MainContext