import { firebaseAuth } from "firebase.app";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface IAuthForm {
  email: string;
  password: string;
  password2: string;
}

export const Auth = () => {
  const { register, formState, handleSubmit, getValues } = useForm<IAuthForm>({
    mode: "onBlur",
  });
  const [isCreating, setIsCreating] = useState<Boolean>(false);

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
          console.log("Passwords input error");
        }
      } else {
        const data = await firebaseAuth.signInWithEmailAndPassword(
          email,
          password
        );
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <input
          ref={register({ required: true })}
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
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
        {isCreating && (
          <input
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
        )}
        <button>{isCreating ? "Create Account" : "Log in"}</button>
      </form>
      <div>
        <button>Continue with google</button>
        <button>Continue with Github</button>
      </div>
      <div>
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
  );
};
