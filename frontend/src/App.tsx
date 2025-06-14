import { useState } from "react";

import AppHeader from "./components/AppHeader";
import FSViewer from "./components/FSViewer";

export default function App() {
  const [location, setLocation] = useState<string[]>([]);

  return (
    <div className="flex top-0 left-0 h-screen w-screen bg-gray-50">
      <AppHeader location={location} setLocation={setLocation} />
      <FSViewer location={location} setLocation={setLocation} />
    </div>
  );
}
