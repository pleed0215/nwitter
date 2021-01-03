import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseAuth, firebaseFS } from "firebase.app";
import React, { useState } from "react";
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
}) => {
  const { register, getValues, setValue, watch } = useForm<IEdit>();
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [editText, setEditText] = useState<string>(nweet);
  const onDeleteClick = async (id: string) => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
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
        <div className="w-full">{nweet}</div>
      )}
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
              <button className="mr-2 w-10" onClick={() => onDeleteClick(id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button className="w-10" onClick={() => onEditStart()}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          ))}
      </div>
    </div>
  );
};
