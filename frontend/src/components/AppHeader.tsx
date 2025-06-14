import React, { useState } from "react";
import { FiChevronRight, FiHome } from "react-icons/fi";

import Logo from "./Logo";
import InfoModal from "./InfoModal";

interface AppHeaderProps {
  className?: string;
  location: string[];
  setLocation: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function AppHeader({
  className = "",
  location,
  setLocation,
}: AppHeaderProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-white border border-gray-300 shadow-sm">
      <div className={`flex flex-row h-full gap-x-5 ${className}`}>
        <Logo
          className="hover:cursor-pointer"
          onClick={() => setShowInfoModal(true)}
        />
        <InfoModal
          show={showInfoModal}
          onDismiss={() => setShowInfoModal(false)}
        />
        <div className="flex flex-row space-x-2 items-center">
          <div
            className="p-2 hover:cursor-pointer"
            onClick={() => setLocation([])}
          >
            <FiHome />
          </div>
          {location.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <FiChevronRight />
              <span
                className="p-2 font-semibold hover:cursor-pointer"
                onClick={() => setLocation((prev) => prev.slice(0, index + 1))}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
