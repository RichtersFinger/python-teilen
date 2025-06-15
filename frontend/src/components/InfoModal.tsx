import { useEffect, useState } from "react";
import { FiAlertCircle, FiGithub } from "react-icons/fi";
import { AiOutlinePython } from "react-icons/ai";

import { useToaster } from "./base/Toaster";
import Modal from "./base/Modal";
import Button from "./base/Button";
import Logo from "./Logo";
import Badge from "./base/Badge";
import Spinner from "./base/Spinner";

interface InfoModalProps {
  show: boolean;
  onDismiss?: () => void;
}

export default function InfoModal({ show, onDismiss }: InfoModalProps) {
  const { toast } = useToaster();

  const [version, setVersion] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch((process.env.REACT_APP_API_BASE_URL ?? "") + "/version")
      .then((response) => {
        setLoading(false);
        if (response.ok) response.text().then((text) => setVersion(text));
        else
          toast(
            "Failed to fetch software version.",
            <FiAlertCircle className="text-red-500" size={20} />
          );
      })
      .catch((error) => {
        setLoading(false);
        toast(
          "Failed to fetch software version.",
          <FiAlertCircle className="text-red-500" size={20} />
        );
        console.error(error);
      });
  }, [toast]);

  return show ? (
    <Modal
      className="w-96"
      header={<h2 className="text-xl font-bold">Software Info</h2>}
      body={
        <div className="flex flex-col space-y-2">
          <Logo />
          <div className="flex flex-row space-x-2">
            <span>Software version: </span>
            {loading ? <Spinner size="xs" /> : <span>{version ?? "-"}</span>}
          </div>
          <div className="flex flex-row space-x-2">
            <a
              href="https://github.com/RichtersFinger/python-teilen"
              target="_blank"
              rel="noreferrer"
            >
              <Badge className="px-4">
                <FiGithub size={20} /> <span>View on GitHub</span>
              </Badge>
            </a>
            <a
              href="https://pypi.org/project/teilen"
              target="_blank"
              rel="noreferrer"
            >
              <Badge className="px-4">
                <AiOutlinePython size={20} /> <span>View on PyPi</span>
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
