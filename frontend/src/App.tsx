import { createContext, useEffect, useState } from "react";

import AppHeader from "./components/AppHeader";
import FSViewer from "./components/FSViewer";
import Spinner from "./components/base/Spinner";
import LoginModal from "./components/LoginModal";

export const AuthContext = createContext<string | undefined>(undefined);

export default function App() {
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [passwordRequired, setPasswordRequired] = useState<boolean | undefined>(
    undefined
  );
  const [location, setLocation] = useState<string[]>([]);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_BASE_URL ?? "") + "/configuration")
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((json) => setPasswordRequired(json.passwordRequired))
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex top-0 left-0 h-screen w-screen bg-gray-50">
      <AuthContext.Provider value={password}>
        <AppHeader location={location} setLocation={setLocation} />
        {passwordRequired === undefined ? (
          <div className="flex h-screen w-screen items-center justify-center">
            {JSON.stringify(passwordRequired)}
            <Spinner />
          </div>
        ) : passwordRequired && password === undefined ? (
          <LoginModal
            show={true}
            onPassword={(password) => setPassword(password)}
          />
        ) : (
          <FSViewer location={location} setLocation={setLocation} />
        )}
      </AuthContext.Provider>
    </div>
  );
}
