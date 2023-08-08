/*global chrome*/

import { useState, useRef, useEffect } from "react";

import { NewPassword, WritePassword } from "../components/TypeWriterNew";
import styles from "../styles/SignUp.module.css";
import anims from "../styles/animations.module.css";
import smile from "../images/520464@2x.png";
import padlock from "../images/padlock.svg";
import arrowBtnSignUp from "../images/arrowBtnLoginTransparent.svg";
import arrowForward from "../images/arrowOnly.svg";
import lock from "../images/2886699.svg";
import badge from "../images/badgeMark.svg";
import eyeOpen from "../images/eyeOpen.svg"
import eyeClosed from '../images/eyeClosed.svg'

import extension from "../api/extension";
import user from "../api/user";

const SignUp = ({
  wantToSignUp,
  setLoggedIn,
  isSubscribed,
  setCheckoutPage,
  clientData,
  setClientData,
  userCreated,
  setUserCreated,
}) => {
  return (
    <Child
      wantToSignUp={wantToSignUp}
      setLoggedIn={setLoggedIn}
      isSubscribed={isSubscribed}
      setCheckoutPage={setCheckoutPage}
      clientData={clientData}
      setClientData={setClientData}
      setUserCreated={setUserCreated}
      userCreated={userCreated}
    />
  );
};

const Child = ({ wantToSignUp }) => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [step, setStep] = useState("1");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emptyPassword, setEmptyPassword] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [token, setToken] = useState(null);

  const [steps, setSteps] = useState({
    stepOne: false,
    stepTwo: false,
    stepThree: false,
    stepFour: false,
  });

  useEffect(() => {
    let search = window.location.search;
    if (search.trim() === "")
      return (window.location = "https://signup.beatific.co");
    search = search.replace("?email=", "").replace("token=", "");
    let split = search.split("&");
    if (split.length !== 2)
      return (window.location = "https://signup.beatific.co");
    setUserEmail(split[0]);
    setToken(split[1]);
  }, []);

  const handleNameNext = () => {
    setStep("2");
  };

  // on render
  useEffect(() => {
    if (step === "1") {
      nameRef.current.focus();
    } else if (step === "2") {
      steps.stepOne = true;
      setSteps({ ...steps });
      // emailRef.current.focus();
    } else if (step === "3") {
      steps.stepTwo = true;
      setSteps({ ...steps });
      passwordRef.current.focus();
    }
  }, [step]);

  const handleClick = (e) => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async () => {
    if (password.trim() === "" || confirmPassword.trim() === "")
      return alert("Passwords cannot be empty!");
    if (password !== confirmPassword) return alert("Passwords doesn't match");
    const data = {
      email: userEmail,
      password: password,
      confirmPassword: confirmPassword,
      token: token,
    };
    const result = await user.changePassword(data);
    if (result.data.success) {
      alert("Password changed successfully! Please open a new tab to login");

      chrome.runtime.sendMessage("nlefhoanajbkkbgclihfeklpimfmgbdm", {
        command: "openPage",
        openLoginPage: "",
      });
    }
  };

  let insideForm;
  if (step === "1") {
    insideForm = (
      <div className={styles.formAction}>
        <label htmlFor="name" className={styles.how}>
          <span
            style={{
              width: "100%",
              textAlign: "center",
              display: "flex",
            }}
          >
            <NewPassword steps={steps} setSteps={setSteps} />
          </span>
        </label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className={styles.inputSection}>
            <div
              className={
                emptyPassword
                  ? `${styles.formInputWrapper} ${styles.wrapperError}`
                  : styles.formInputWrapper
              }
              style={{ marginLeft: "142.5px" }}
            >
              <div className={styles.formInput} id="nameInput">
                <span className={styles.icon}>
                  <img
                    src={lock}
                    className={styles.smallSmile}
                    alt="smile icon"
                  />
                </span>
                <div className={styles.inputAndWarning}>
                  <input
                    placeholder="New password"
                    ref={nameRef}
                    style={{
                      paddingLeft: "10px",
                      width: "560px",
                      height: "40px",
                    }}
                    type="password"
                    name="name"
                    id="name"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        e.preventDefault();
                        handleNameNext();
                      }
                    }}
                    required
                  />
                  {emptyPassword && (
                    <span className={styles.requiredMsg}>
                      Password cannot be a blank
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleNameNext()}
              className={styles.forwardBtn}
            >
              <img
                src={arrowForward}
                className={styles.arrowBtn}
                alt="go to next form step"
              />
            </button>
          </div>
          <div className={styles.badgeSection}>
            <img
              src={badge}
              className={`${styles.badge} ${anims.scaleUpCenter}`}
              alt="badge"
            />
            <div className={styles.dot}></div>
          </div>
        </div>
      </div>
    );
  } else if (step === "2") {
    insideForm = (
      <div className={styles.formAction}>
        <label htmlFor="name">
          <span
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <span style={{ fontSize: "2px", color: "transparent" }}>This</span>
            <WritePassword steps={steps} setSteps={setSteps} />
          </span>
        </label>
        <div className={styles.inputSection}>
          <button
            type="button"
            onClick={() => setStep("1")}
            className={styles.backBtn}
          >
            <img
              src={arrowForward}
              className={styles.backArrowBtn}
              alt="go to previous form step"
            />
          </button>
          <div className={styles.formInput} id="emailGroup">
            <span className={styles.icon}>
              <img src={lock} alt="lock icon" className={styles.lock} />
            </span>
            <input
              style={{ paddingLeft: "10px" }}
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Confirm password"
              ref={passwordRef}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <span className={styles.showPass} onClick={handleClick}>
              {passwordVisible ? (
                <img src={eyeOpen} className={styles.eye} alt="" />
              ) : (
                <img src={eyeClosed} className={styles.eye} alt="" />
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              handleSubmit();
            }}
            className={styles.forwardBtn}
            disabled={password === ""}
          >
            <img
              src={arrowForward}
              className={styles.arrowBtn}
              alt="go to next form step"
            />
          </button>
        </div>
        <div className={styles.badgeSection}>
          <img src={badge} className={styles.badge} alt="badge" />
          <img
            src={badge}
            className={styles.badge}
            alt="badge"
            style={{ marginLeft: "-20px" }}
          />
        </div>
      </div>
    );
  }

  let welcome;

  return (
    <div className={styles.container}>
      <section className={styles.signUpActions}>
        <div className={styles.iconSection}>
          <img
            width={step === "2" ? 65 : 68}
            height={step === "2" ? 65 : 68}
            src={step === "2" ? padlock : smile}
            className={step === "2" ? styles.padlockImg : styles.smileImg}
            alt={step === "2" ? "Padlock" : "Smiling face"}
          />
        </div>
        <h1 className={styles.greeting}>Hi!</h1>
        <form>{insideForm}</form>
      </section>
      <div className={styles.footerLinks}>
        <p>HAVE AN ACCOUNT?</p>
        <p>LOG IN</p>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("signUpForm");
            // wantToSignUp(false);
            extension.openLoginPage();
          }}
        >
          <img src={arrowBtnSignUp} className={styles.arrow} alt="Arrow" />
        </button>
      </div>
    </div>
  );
};

export default SignUp;
