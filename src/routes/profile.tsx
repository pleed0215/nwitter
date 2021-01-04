import { firebaseAuth, firebaseStorage } from "firebase.app";
import React, { useRef, useState } from "react";
import { IProfileText } from "components/App";
import { PreviousMap } from "postcss";

interface IProfile {
  setProfileText: React.Dispatch<IProfileText>;
  profileText: IProfileText;
}

export const Profile: React.FC<IProfile> = ({
  setProfileText,
  profileText,
}) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [inputName, setInputName] = useState<string>("");

  const fileRef = useRef<HTMLInputElement>(null);
  const onLogOutClick = () => firebaseAuth.signOut();
  const onNameChangeClick = () => {
    setIsEditing(true);
    if (profileText && profileText.displayName)
      setInputName(profileText?.displayName);
  };
  const onNameChangeDone = async () => {
    if (
      inputName &&
      Boolean(inputName) &&
      inputName !== profileText.displayName
    ) {
      setProfileText({
        displayName: inputName,
        email: profileText.email,
      });
      await firebaseAuth?.currentUser?.updateProfile({
        displayName: inputName,
        photoURL: firebaseAuth.currentUser.photoURL,
      });
    }
    setIsEditing(false);
  };

  const onPhotoChange = () => {
    if (fileRef.current && fileRef.current.files) {
      const file: File = fileRef?.current?.files[0];
      const fileReader = new FileReader();
      let imageData = null;
      fileReader.readAsDataURL(file);
      fileReader.onloadend = async (ev) => {
        imageData = ev.target?.result;
        if (typeof imageData === "string") {
          if (imageData) {
            const uploadTask = await firebaseStorage
              .ref()
              .child(`${firebaseAuth.currentUser?.uid}/profile`)
              .putString(imageData, "data_url");
            const photoURL: string = await uploadTask.ref.getDownloadURL();
            firebaseAuth.currentUser?.updateProfile({
              photoURL,
            });
            setProfileText({ ...profileText, photoUrl: photoURL });
          }
        }
      };
    }
  };

  return (
    <div className="flex flex-col w-full mt-4 p-2">
      <div className="flex flex-col justify-center items-center w-full">
        <button
          className="w-full py-3 bg-blue-400 text-white hover:bg-blue-600 transition duration-200 mb-4"
          onClick={onLogOutClick}
        >
          Logout
        </button>
        <div
          className="border bg-cover bg-center w-32 h-32 rounded-full  border-gray-400"
          style={{
            backgroundImage: `url(${profileText.photoUrl})`,
          }}
        ></div>
        <input
          name="files"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileRef}
          onChange={onPhotoChange}
        />

        <button
          onClick={() => fileRef.current?.click()}
          className="mt-2 bg-blue-400 text-white hover:bg-blue-600 px-2 py-3 transition duration-200"
        >
          Change Photo
        </button>
      </div>
      <div className="border mt-10 flex flex-col p-4 relative items-center">
        <div className="absolute -top-4 py-2 px-2 bg-indigo-400 text-white rounded-lg">
          Profile
        </div>
        <div className="w-full flex flex-col items-start justify-start mt-4">
          <div className="w-full flex items-center py-3">
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 outline-none border border-gray-200 mr-3"
                  name="inputName"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                />
                <button
                  onClick={onNameChangeDone}
                  className="bg-blue-400 text-white hover:bg-blue-600 px-2 py-2"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <span className="w-full">
                  Display Name: {profileText.displayName}
                </span>
                <button
                  onClick={onNameChangeClick}
                  className="bg-blue-400 text-white hover:bg-blue-600 px-2 py-2"
                >
                  Change
                </button>
              </>
            )}
          </div>
          <div className="w-full flex items-center py-3">
            <span>Email: {profileText.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
