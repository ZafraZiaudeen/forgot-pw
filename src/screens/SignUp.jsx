/*global chrome*/

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingState, updateErrorMessage } from "../actions/common";

import Alert from "../components/Alert";

import { NewPassword, WritePassword } from "../components/TypeWriterNew";
import styles from "../styles/SignUp.module.css";
import anims from "../styles/animations.module.css";
import smile from "../images/smile.png";
import padlock from "../images/locked.png";
import arrowBtnSignUp from "../images/arrowBtnLoginTransparent.svg";
import arrowForward from "../images/arrowOnly.svg";
import lock from "../images/2886699.svg";
import badge from "../images/badgeMark.svg";
import eyeOpen from "../images/eyeOpen.svg";
import eyeClosed from "../images/eyeClosed.svg";

import extension from "../api/extension";
import user from "../api/user";
import NextButton from "../components/NextButton";

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
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const [steps, setSteps] = useState({
    stepOne: false,
    stepTwo: false,
    stepThree: false,
    stepFour: false,
  });

  useEffect(() => {
    let search = window.location.search;
    if (search.trim() === "")
      return (window.location = "https://signup-p4se08703-zafraziaudeen-gmailcoms-projects.vercel.app");
    search = search.replace("?email=", "").replace("token=", "");
    let split = search.split("&");
    if (split.length !== 2)
      return (window.location = "https://signup-p4se08703-zafraziaudeen-gmailcoms-projects.vercel.app");
    setUserEmail(split[0]);
    setToken(split[1]);
  }, []);

  const handleNameNext = () => {
    if (password.trim() === "")
      return dispatch(
        updateErrorMessage({
          message:
            "Uh-oh! 🙈 It seems you forgot to add the magic word. A password, please add one! 🔒😅",
          negative: true,
          animated: true,
        })
      );
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    if (!regex.test(password))
      return dispatch(
        updateErrorMessage({
          message:
            "Mix 8 characters, sprinkle uppercase and lowercase letters generously, and numbers",
          negative: true,
          animated: true,
        })
      );

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
    dispatch(setLoadingState(true));

    try {
      if (password.trim() === "" || confirmPassword.trim() === "") {
        dispatch(setLoadingState(false));
        return setErrorMsg({
          message: "Passwords cannot be empty!",
          negative: true,
        });
      }

      if (password !== confirmPassword) {
        dispatch(setLoadingState(false));
        return dispatch(
          updateErrorMessage({
            message: "Passwords doesn't match",
            negative: true,
          })
        );
      }

      const data = {
        email: userEmail,
        password: password,
        confirmPassword: confirmPassword,
        token: token,
      };
      setSubmitted(true);
      const result = await user.changePassword(data);
      dispatch(setLoadingState(false));

      if (result.data?.success) {
        dispatch(
          updateErrorMessage({
            negative: false,
            message: "Yeeeees! you just change your password! 😃",
            timeout: 5000,
          })
        );
        setTimeout(() => {
          chrome.runtime.sendMessage("nlefhoanajbkkbgclihfeklpimfmgbdm", {
            command: "openPage",
            openLoginPage: "",
          });
        }, 5000);
      } else {
        setSubmitted(false);
        dispatch(setLoadingState(false));
      }
    } catch (err) {
      setSubmitted(false);
      dispatch(setLoadingState(false));
    }
  };

  let insideForm;
  if (step === "1") {
    insideForm = (
      <div className={styles.formAction}>
        <Alert errorMessage={errorMsg} setErrorMessage={setErrorMsg} />
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
          className={styles.nameInputWrapper}
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
              disabled={submitted}
            />
            <span className={styles.showPass} onClick={handleClick}>
              {passwordVisible ? (
                <img src={eyeOpen} className={styles.eye} alt="" />
              ) : (
                <img src={eyeClosed} className={styles.eye} alt="" />
              )}
            </span>
          </div>
          <NextButton
            onClick={handleSubmit}
            styles={styles}
            disabled={password === "" || confirmPassword === "" || submitted}
          />
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
      <Alert errorMessage={errorMsg} setErrorMessage={setErrorMsg} />
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
