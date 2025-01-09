import {createContext} from "react"

interface MainContextType {
    Demo: string; // Replace 'any' with the appropriate type
    setDemo: React.Dispatch<React.SetStateAction<string>>;
    ChangeCodeEditorDesign:Function;
    setCodeOfEditor:React.Dispatch<React.SetStateAction<string>>;
    CodeOfEditor:string;
    handleEditorChange:Function;
    profilePicture: File ;
     setProfilePicture:React.Dispatch<React.SetStateAction<File>>;
     defaultProfilePicture:string;
     initialProfilePicture:string;
      setinitialProfilePicture:React.Dispatch<React.SetStateAction<string>>;
  }
  const MainContext = createContext<MainContextType>({
    Demo: "",
    setDemo: () => {}, // No-op default function
    ChangeCodeEditorDesign: () => {}, // No-op default function
    setCodeOfEditor: () => {}, // Default function to avoid null checks
    CodeOfEditor: "",
    handleEditorChange: () => {}, // Default function
    profilePicture: new File([""], "filename"),
     setProfilePicture:()=>{},
     defaultProfilePicture:"",
     initialProfilePicture:"",
      setinitialProfilePicture:()=>{}

  });
  
export default MainContext