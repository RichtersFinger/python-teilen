import { useEffect, useState } from "react";
import { FiGithub } from "react-icons/fi";
import { AiOutlinePython } from "react-icons/ai";

import Modal from "./base/Modal";
import Button from "./base/Button";
import Logo from "./Logo";
import Badge from "./base/Badge";

interface InfoModalProps {
  show: boolean;
  onDismiss?: () => void;
}

export default function InfoModal({ show, onDismiss }: InfoModalProps) {
  const [version, setVersion] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_BASE_URL ?? "") + "/version")
      .then((response) => {
        if (response.ok) response.text().then((text) => setVersion(text));
      })
      .catch((error) => console.error(error));
  }, []);

  return show ? (
    <Modal
      className="w-96"
      header={<h2 className="text-xl font-bold">Software Info</h2>}
      body={
        <div className="flex flex-col space-y-2">
          <Logo />
          <div>
            <span>Software version: </span>
            <span className="font-mono">{version}</span>
          </div>
          <div className="flex flex-row space-x-2">
            <a
              href="https://pypi.org/project/teilen"
              target="_blank"
              rel="noreferrer"
            >
              <Badge>
                <AiOutlinePython size={20} /> <span>View on PyPi</span>
              </Badge>
            </a>
            <a
              href="https://github.com/RichtersFinger/python-teilen"
              target="_blank"
              rel="noreferrer"
            >
              <Badge>
                <FiGithub size={20} /> <span>View on GitHub</span>
              </Badge>
            </a>
          </div>
          <span className="text-sm">Copyright (c) 2025 • MIT License</span>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={onDismiss}>Close</Button>
        </div>
      }
      onDismiss={onDismiss}
    />
  ) : null;
}
