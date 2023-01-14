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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.eye}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.eye}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
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
