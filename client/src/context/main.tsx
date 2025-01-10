import { createContext } from "react";

interface MainContextType {
  Demo: string; // Replace 'any' with the appropriate type
  setDemo: React.Dispatch<React.SetStateAction<string>>;
  ChangeCodeEditorDesign: Function;
  setCodeOfEditor: React.Dispatch<React.SetStateAction<string>>;
  CodeOfEditor: string;
  handleEditorChange: Function;
  profilePicture: File;
  setProfilePicture: React.Dispatch<React.SetStateAction<File>>;
  defaultProfilePicture: string;
  initialProfilePicture: string;
  setinitialProfilePicture: React.Dispatch<React.SetStateAction<string>>;
  handleShowProfileToggle: Function;
  ShowEditProfile: boolean;
  ShowProfile: boolean;
  setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
  updateProfileInformation: Function;
  ServerUrl:string;

}
const MainContext = createContext<MainContextType>({
  Demo: "",
  setDemo: () => {}, // No-op default function
  ChangeCodeEditorDesign: () => {}, // No-op default function
  setCodeOfEditor: () => {}, // Default function to avoid null checks
  CodeOfEditor: "",
  handleEditorChange: () => {}, // Default function
  profilePicture: new File([""], "filename"),
  setProfilePicture: () => {},
  defaultProfilePicture: "",
  initialProfilePicture: "",
  setinitialProfilePicture: () => {},
  handleShowProfileToggle: () => {},
  ShowEditProfile: false,
  ShowProfile: false,
  setShowEditProfile: () => {},
  setShowProfile: () => {},
  updateProfileInformation: (data: any) => {
    data;
  },
  ServerUrl:""

});

export default MainContext;
