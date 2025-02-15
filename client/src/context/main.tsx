import { createContext } from "react";

interface MainContextType {
  Demo: string; // Replace 'any' with the appropriate type
  setDemo: React.Dispatch<React.SetStateAction<string>>;
  ChangeCodeEditorDesign: Function;
  profilePicture: File;
  setProfilePicture: React.Dispatch<React.SetStateAction<File>>;
  defaultProfilePicture: string;
  WEBSOCKET_URL:string;
  initialProfilePicture: string;
  setinitialProfilePicture: React.Dispatch<React.SetStateAction<string>>;
  handleShowProfileToggle: Function;
  ShowEditProfile: boolean;
  ShowProfile: boolean;
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
  updateProfileInformation: Function;
  SERVER_URL:string;
  handleCodeExecution:Function;
  

}
const MainContext = createContext<MainContextType>({
  Demo: "",
  setDemo: () => {}, // No-op default function
  ChangeCodeEditorDesign: () => {}, // No-op default function
  profilePicture: new File([""], "filename"),
  setProfilePicture: () => {},
  defaultProfilePicture: "",
  initialProfilePicture: "",
  setinitialProfilePicture: () => {},
  handleShowProfileToggle: () => {},
  ShowEditProfile: false,
  WEBSOCKET_URL:"",
  ShowProfile: false,
  setShowEditProfile: () => {},
  setShowProfile: () => {},
  updateProfileInformation: (data: any) => {
    data;
  },
  SERVER_URL:"",
  handleCodeExecution:(data:any)=>{data}

});

export default MainContext;
