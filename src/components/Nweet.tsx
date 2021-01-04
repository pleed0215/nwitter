import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseAuth, firebaseFS, firebaseStorage } from "firebase.app";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { INweet } from "routes/home";

interface INweetComponent extends INweet {}

interface IEdit {
  text: string;
}

export const Nweet: React.FC<INweetComponent> = ({
  id,
  creatorId,
  createdAt,
  nweet,
  imageUrl,
}) => {
  const { register, getValues, setValue, watch } = useForm<IEdit>();
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [editText, setEditText] = useState<string>(nweet);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const getImageUrl = async () => {
    if (imageUrl) {
      setImagePath(
        await firebaseStorage
          .ref()
          .child(`${creatorId}/${imageUrl}`)
          .getDownloadURL()
      );
    } else {
      setImagePath(`${process.env.PUBLIC_URL}/noimage.png`);
    }
  };

  useEffect(() => {
    getImageUrl();
  }, []);

  const onDeleteClick = async (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      if (imageUrl) {
        await firebaseStorage
          .ref()
          .child(`${firebaseAuth.currentUser?.uid}/${imageUrl}`)
          .delete();
      }

      await firebaseFS.collection("nweets").doc(id).delete();
    }
  };

  const onEditDone = async (id: string) => {
    const { text } = getValues();
    await firebaseFS.collection("nweets").doc(id).update({
      nweet: text,
    });
    setIsEditing(false);
  };

  const onEditStart = () => {
    setEditText(nweet);
    setIsEditing(true);
  };

  return (
    <div className="w-full flex flex-start items-center py-2">
      {isEditing ? (
        <input
          ref={register()}
          placeholder="Write yours"
          className="w-full p-1 border border-gray-500 outline-none"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          name="text"
          type="text"
        />
      ) : (
        <div className="flex items-center w-full border border-gray-400">
          <div className=" border-r  border-gray-400  h-28 w-32 mr-2 p-1 flex justify-center items-center">
            {imagePath ? (
              <img className="w-full h-full" src={imagePath} alt={`${nweet}`} />
            ) : (
              <></>
            )}
          </div>
          <div className="w-full">{nweet}</div>
          <div className="w-20 flex ">
            {firebaseAuth?.currentUser?.uid === creatorId &&
              (isEditing ? (
                <button
                  className="ml-2 w-full p-1 text-center bg-blue-400 text-white hover:bg-blue-600 transition duration-200"
                  onClick={() => onEditDone(id)}
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    className="mr-2 w-10"
                    onClick={() => onDeleteClick(id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className="w-10" onClick={() => onEditStart()}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
