import {createContext} from "react"

interface MainContextType {
    Demo: string; // Replace 'any' with the appropriate type
    setDemo: React.Dispatch<React.SetStateAction<string>>;
    ChangeCodeEditorDesign:Function;
    setCodeOfEditor:React.Dispatch<React.SetStateAction<string>>;
    CodeOfEditor:string;
    handleEditorChange:Function;
  }
  const MainContext = createContext<MainContextType>({
    Demo: "",
    setDemo: () => {}, // No-op default function
    ChangeCodeEditorDesign: () => {}, // No-op default function
    setCodeOfEditor: () => {}, // Default function to avoid null checks
    CodeOfEditor: "",
    handleEditorChange: () => {}, // Default function
  });
  
export default MainContext