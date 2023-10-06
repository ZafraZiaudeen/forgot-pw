import React, { useEffect, useRef, useCallback } from "react";
import styles from "../styles/alert.module.scss";

import { ReactComponent as FailedIcon } from "../images/black_x.svg";
import { ReactComponent as ErrorBell } from "../images/errorBell.svg";
import { ReactComponent as SuccessBell } from "../images/successNotificationIcon.svg";

export default function Alert({ timer, errorMessage, setErrorMessage }) {
  const alertRef = useRef();

  const negative = errorMessage?.negative;
  const message = errorMessage?.message;

  const setMessage = useCallback(
    (msg) => {
      setErrorMessage({ message: msg });
    },
    [setErrorMessage]
  );
  const setNegative = useCallback(
    (bool) => {
      setErrorMessage({ negative: bool });
    },
    [setErrorMessage]
  );

  const handleClose = () => {
    if (alertRef.current) {
      alertRef.current.classList.add(styles.slideOut);
      setMessage(null);
      setNegative(false);
    }
  };

  useEffect(() => {
    if (!message) return;

    const runTimer = () => {
      setTimeout(() => {
        if (alertRef.current) {
          alertRef.current.classList.add(styles.slideOut);
          setMessage(null);
          setNegative(false);
        }
      }, timer || 10000);
    };

    runTimer();

    return () => {
      clearTimeout(runTimer);
      runTimer();
    };
  }, [message, setMessage, timer]);

  if (message)
    return (
      <div className={styles.wrapper}>
        <div
          className={`${styles.alertContainer} ${styles.active}`}
          ref={alertRef}
        >
          {!negative && <SuccessBell />}
          {negative && <ErrorBell />}

          <span className={styles.messageText}>
            {message ||
              "Oops! Mind typing in the right current password for us? 😊"}
          </span>
          <div className={styles.iconContainer}>
            <FailedIcon className={styles.alertIcon} onClick={handleClose} />
          </div>
        </div>
      </div>
    );
}
