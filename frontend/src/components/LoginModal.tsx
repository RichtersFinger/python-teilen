import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

import Modal from "./base/Modal";
import TextInput from "./base/TextInput";
import Spinner from "./base/Spinner";

interface LoginModalProps {
  show: boolean;
  onPassword: (password: string) => void;
}

export default function LoginModal({ show, onPassword }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [passwordOk, setPasswordOk] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch((process.env.REACT_APP_API_BASE_URL ?? "") + "/login", {
      headers: {
        "X-Teilen-Auth": password,
      },
    })
      .then((response) => {
        setLoading(false);
        setPasswordOk(response.ok);
        if (response.ok) onPassword(password);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [password]);

  return show ? (
    <Modal
      className="w-96"
      header={<h2 className="text-xl font-bold">Password required</h2>}
      body={
        <div className="flex flex-col space-y-2">
          <span>Please enter the password for this share</span>
          <div className="flex flex-row items-center space-x-2">
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loading ? (
              <Spinner size="xs" />
            ) : passwordOk ? (
              <FiCheckCircle className="text-green-500" size={25} />
            ) : password !== "" ? (
              <FiXCircle className="text-red-500" size={25} />
            ) : null}
          </div>
        </div>
      }
    />
  ) : null;
}
