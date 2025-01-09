import React from "react";

interface SidebarProps {
  onOptionChange: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOptionChange }) => {
  const options = [
    { label: "General", value: "General" },
    { label: "Personal", value: "Personal" },
    { label: "Professional", value: "Professional" },
    { label: "Login", value: "Login" },
    { label: "Change Username", value: "Change Username" },
    { label: "Notifications", value: "Notifications" },
    { label: "Privacy", value: "Privacy" },
  ];

  return (
    <div className="sidebar">
      <h3 className="username">gehlotnikhil38</h3>
      <ul className="sidebar-list">
        {options.map((option) => (
          <li
            key={option.value}
            className="sidebar-item"
            onClick={() => onOptionChange(option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
