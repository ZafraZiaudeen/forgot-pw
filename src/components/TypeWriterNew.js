import React, { useEffect } from "react";
import styles from "../styles/TypeWriter.module.css";
import Typewriter from "typewriter-effect";

export function NewPassword({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepOne = true;
    setSteps({ ...steps });
  };

  useEffect(() => {
    let isStep1 = localStorage.getItem("step1");
    if (isStep1) {
      steps.stepOne = true;
      setSteps({ ...steps });
    }
  }, []);

  return (
    <div className={styles.container}>
      <span id="txt-type">
        {steps.stepOne ? "Enter a new Password" : ""}
        {!steps.stepOne && (
          <Typewriter
            onInit={(typewriter) => {
              localStorage.setItem("step1", true);
              typewriter
                .typeString("Enter a ne")
                .pauseFor(200)
                .deleteChars(2)
                .typeString("w password")
                .start()
                .callFunction(completeStep);
            }}
            options={{
              delay: 100,
            }}
          />
        )}
      </span>
    </div>
  );
}
export function WriteEmail({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepTwo = true;
    setSteps({ ...steps });
  };

  useEffect(() => {
    let isStepTwo = localStorage.getItem("step2");
    if (isStepTwo) {
      steps.stepTwo = true;
      setSteps({ ...steps });
    }
  }, []);

  if (steps.stepTwo) {
    return <>What is your email?</>;
  } else {
    return (
      <Typewriter
        onInit={(typewriter) => {
          localStorage.setItem("step2", true);
          typewriter
            .typeString("What is your email")
            .pauseFor(500)
            .typeString("?")
            .start()
            .callFunction(completeStep);
        }}
        options={{
          delay: 100,
        }}
      />
    );
  }
}
export function WritePassword({ steps, setSteps }) {
  const completeStep = () => {
    steps.stepThree = true;
    setSteps({ ...steps });
  };

  useEffect(() => {
    let isStepThree = localStorage.getItem("step3");
    if (isStepThree) {
      steps.stepThree = true;
      setSteps({ ...steps });
    }
  }, []);

  if (steps.stepThree) {
    return <>Confirm the new password</>;
  } else {
    return (
      <Typewriter
        onInit={(typewriter) => {
          localStorage.setItem("step3", true);
          typewriter
            .typeString("Confirm  the new")
            .deleteChars(6)
            .pauseFor(200)
            .typeString(" password")
            .start()
            .callFunction(completeStep);
        }}
        options={{
          delay: 100,
        }}
      />
    );
  }
}


