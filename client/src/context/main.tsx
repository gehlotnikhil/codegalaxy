import { createContext } from "react";
interface EntireUserDetailType {
  id: string | null;
  name: string | null;
  age: number | null;
  gender: string | null;
  userName: string | null;
  email: string | null;
  collegeName: string | null;
  contestDetails: any | null;
  country: string | null;
  googleLoginAccess: string | null;
  noOfContestParticipated: number | null;
  noOfProblemSolved: number | null;
  role: any | null;
  solvedProblemDetails: any | null;
  state: string | null;
  totalRank: number | null;
  token: string | null;
  profilePictureUrl: string | null;
  password: string | null;
}
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
  EntireUserDetail: EntireUserDetailType;
  setEntireUserDetail: React.Dispatch<
    React.SetStateAction<EntireUserDetailType>
  >;
  fetchUserDetailFromLocalStorage: Function;
  setUserDetailToLocalStorage:Function;
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
  EntireUserDetail: {
    id: null,
    name: null,
    age: null,
    gender: null,
    userName: null,
    email: null,
    collegeName: null,
    contestDetails: null,
    country: null,
    googleLoginAccess: null,
    noOfContestParticipated: null,
    noOfProblemSolved: null,
    role: null,
    solvedProblemDetails: null,
    state: null,
    totalRank: null,
    token: null,
    profilePictureUrl: null,
    password: null,
  },
  setEntireUserDetail: () => {},
  fetchUserDetailFromLocalStorage: (query: string, data: any): boolean => {
    query;
    data;
    return false;
  },
  setUserDetailToLocalStorage: (query: string, data: any): boolean => {
    query;
    data;
    return false;
  }
});

export default MainContext;
