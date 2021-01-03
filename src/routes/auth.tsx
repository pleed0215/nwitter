import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseApp, firebaseAuth, firebaseInstance } from "firebase.app";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface IAuthForm {
  email: string;
  password: string;
  password2: string;
}

export const Auth = () => {
  const {
    register,
    formState,
    handleSubmit,
    getValues,
    errors,
  } = useForm<IAuthForm>({
    mode: "onBlur",
  });
  const [isCreating, setIsCreating] = useState<Boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit = async () => {
    const { email, password, password2 } = getValues();
    try {
      if (isCreating) {
        if (password === password2) {
          const data = await firebaseAuth.createUserWithEmailAndPassword(
            email,
            password
          );
        } else {
          setAuthError("Please verify your password");
        }
      } else {
        const data = await firebaseAuth.signInWithEmailAndPassword(
          email,
          password
        );
      }
    } catch (e) {
      setAuthError(e.message);
    }
  };

  const onSocialClick = async (event: any) => {
    const {
      target: { name },
    } = event;

    try {
      let provider = null;
      if (name === "google") {
        provider = new firebaseInstance.auth.GoogleAuthProvider();
      } else if (name === "github") {
        provider = new firebaseInstance.auth.GithubAuthProvider();
      }

      if (provider) await firebaseAuth.signInWithPopup(provider);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-screen-sm flex flex-col items-center mt-32">
        <div className="w-full h-16 text-2xl italic bg-gray-700 text-white flex items-center justify-center">
          {isCreating ? "Create Account" : "Log in"}
        </div>
        <form
          className="w-full  flex flex-col py-6 px-4 border border-gray-200"
          method="post"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-start w-full mb-4">
            <input
              className="border border-gray-400 py-3 px-2 text-lg w-full outline-none"
              ref={register({
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Please write valid email address",
                },
              })}
              type="email"
              name="email"
              placeholder="Email"
              required
            />
            {errors.email && (
              <span className="text-red-600 italic text-sm font-thin">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start w-full mb-4">
            <input
              className="border border-gray-400 py-3 px-2 text-lg w-full outline-none"
              ref={register({
                required: true,

                minLength: {
                  value: 8,
                  message: "Password must be longer than 8 length.",
                },
                maxLength: {
                  value: 16,
                  message: "Password must be shorter than 16 length.",
                },
              })}
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            {errors.password && (
              <span className="text-red-600 italic text-sm font-thin">
                {errors.password.message}
              </span>
            )}
          </div>
          {isCreating && (
            <div className="flex flex-col items-start w-full mb-4">
              <input
                className="border border-gray-400 py-3 px-2 text-lg w-full outline-none"
                ref={register({
                  required: true,
                  minLength: {
                    value: 8,
                    message: "Password must be longer than 8 length.",
                  },
                  maxLength: {
                    value: 16,
                    message: "Password must be shorter than 16 length.",
                  },
                })}
                type="password"
                name="password2"
                placeholder="Verify password"
                required
              />
              {errors.password2 && (
                <span className="text-red-600 italic text-sm font-thin">
                  {errors.password2.message}
                </span>
              )}
            </div>
          )}
          {authError && (
            <div className="w-full text-red-600 mb-4">
              <span>{authError}</span>
            </div>
          )}
          <button className="mx-auto w-1/2 text-center text-xl py-5 bg-blue-200 text-blue-400 hover:bg-blue-600 hover:text-blue-200 transition duration-200">
            {isCreating ? "Create Account" : "Log in"}
          </button>
        </form>
        <div className="w-full py-4 flex justify-around">
          <button
            onClick={onSocialClick}
            name="google"
            className="py-4 text-center text-xl bg-red-600 text-white px-4 hover:bg-red-400 transition duration-200"
          >
            <FontAwesomeIcon
              className="mr-2 border border-white rounded-full p-1 text-2xl"
              icon={faGoogle}
            />
            Continue with Google
          </button>
          <button
            onClick={onSocialClick}
            name="github"
            className="py-4 text-center text-xl bg-gray-800 text-white px-4 hover:bg-gray-600 transition duration-200"
          >
            <FontAwesomeIcon icon={faGithub} className="mr-2" />
            Continue with Github
          </button>
        </div>
        <div className="text-xl">
          <p>
            {isCreating
              ? "You already have account? Then, "
              : "Don't you have any account? Then, "}
            <span
              className=" cursor-pointer text-blue-500 hover:font-bold"
              onClick={() => setIsCreating(!isCreating)}
            >
              {isCreating ? "Log in" : "Create account."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
