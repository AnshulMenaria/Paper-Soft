import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Pages/Login/Login";
import Register from "./Components/Pages/Register/Register";
import AdminHome from "./Components/Pages/Admin/Home/AdminHome";
import LetterList from "./Components/Pages/Admin/LetterList/LetterList";
import Logout from "./Components/Pages/Logout";
import Settings from "./Components/Pages/Admin/Settings/Settings";
import CreateLetter from "./Components/Pages/Admin/CreateLetter/CreateLetter";
import ViewLetter from "./Components/Pages/Admin/ViewLetter/ViewLetter";
import HeViewLetter from "./Components/Pages/Hierarchy/HeViewLetter/HeViewLetter";
import AdminLetterHome from "./Components/Pages/Admin/LetterList/AdminLetterHome";
import HeLetterList from "./Components/Pages/Hierarchy/HeLetterList/HeLetterList";
import HEHome from "./Components/Pages/Hierarchy/HeHome/HEHome";
import HierarchySetting from "./Components/Pages/Hierarchy/HeSetting/HierarchySetting";
import FilterLetters from "./Components/Pages/Hierarchy/HeLetterList/FilterLetters";
import AHome from "./Components/Pages/Category/A/AHome/AHome";
import ALetterList from "./Components/Pages/Category/A/ALetterList/ALetterList";
import ALetterView from "./Components/Pages/Category/A/ALetterView/ALetterView";
import ASetting from "./Components/Pages/Category/A/ASetting/ASetting";
import GHome from "./Components/Pages/Category/G/GHome/GHome";
import GLetterList from "./Components/Pages/Category/G/GLetterList/GLetterList";
import GLetterView from "./Components/Pages/Category/G/GLetterView/GLetterView";
import GSetting from "./Components/Pages/Category/G/GSetting/GSetting";
import PriHome from "./Components/Pages/Category/PRI/PriHome/PriHome";
import PriLetterList from "./Components/Pages/Category/PRI/PriLetterList/PriLetterList";
import PriLetterView from "./Components/Pages/Category/PRI/PriLetterView/PriLetterView";
import PriSetting from "./Components/Pages/Category/PRI/PriSetting/PriSetting";
import PubHome from "./Components/Pages/Category/Publication/PubHome/PubHome";
import PubLetterList from "./Components/Pages/Category/Publication/PubLetterList/PubLetterList";
import PubLetterView from "./Components/Pages/Category/Publication/PubLetterView/PubLetterView";
import PubSetting from "./Components/Pages/Category/Publication/PubSetting/PubSetting";
import QHome from "./Components/Pages/Category/Q/QHome/QHome";
import QLetterList from "./Components/Pages/Category/Q/QLetterList/QLetterList";
import QLetterView from "./Components/Pages/Category/Q/QLetterView/QLetterView";
import QSetting from "./Components/Pages/Category/Q/QSetting/QSetting";
import RemarkNotifier from "./Components/context/RemarkNotifier";

function App() {
  return (
    <BrowserRouter>
    <RemarkNotifier/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/hierarchy-home" element={<HEHome />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin-letters/:filter" element={<AdminLetterHome />} />
        <Route path="/create-letter" element={<CreateLetter />} />
        <Route path="/letterlist" element={<LetterList />} />
        <Route path="/admin-viewletter" element={<ViewLetter />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/he-letterlist" element={<HeLetterList />} />
        <Route path="/he-setting" element={<HierarchySetting />} />
        <Route path="/hierarchy-viewletter" element={<HeViewLetter />} />
        <Route path="/hierarchy-home/:filter" element={<FilterLetters />} />
        <Route path="/A-home" element={<AHome />} />
        <Route path="/A-letterlist" element={<ALetterList />} />
        <Route path="/A-letterview" element={<ALetterView />} />
        <Route path="/A-setting" element={<ASetting />} />
        <Route path="/G-home" element={<GHome />} />
        <Route path="/G-letterlist" element={<GLetterList />} />
        <Route path="/G-letterview" element={<GLetterView />} />
        <Route path="/G-setting" element={<GSetting />} />
        <Route path="/Pri-home" element={<PriHome />} />
        <Route path="/Pri-letterlist" element={<PriLetterList />} />
        <Route path="/Pri-letterview" element={<PriLetterView />} />
        <Route path="/Pri-setting" element={<PriSetting />} />
        <Route path="/Pub-Home" element={<PubHome />} />
        <Route path="/Pub-letterlist" element={<PubLetterList />} />
        <Route path="/Pub-letterview" element={<PubLetterView />} />
        <Route path="/Pub-setting" element={<PubSetting />} />
        <Route path="/Q-home" element={<QHome />} />
        <Route path="/Q-letterlist" element={<QLetterList />} />
        <Route path="/Q-letterview" element={<QLetterView />} />
        <Route path="/Q-setting" element={<QSetting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
