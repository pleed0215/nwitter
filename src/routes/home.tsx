import { Nweet } from "components/Nweet";
import { firebaseAuth, firebaseFS } from "firebase.app";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IMessageForm {
  message: string;
}

export interface INweet {
  id: string;
  creatorId: string;
  nweet: string;
  createdAt: Date;
}

export const Home = () => {
  const {
    register,
    handleSubmit,
    getValues,
    errors,
    reset,
  } = useForm<IMessageForm>();
  const [nweets, setNweets] = useState<INweet[]>([]);
  const onSubmit = async () => {
    const { message } = getValues();
    await firebaseFS.collection("nweets").add({
      nweet: message,
      creatorId: firebaseAuth.currentUser?.uid,
      createdAt: Date.now(),
    });
    reset();
  };
  const getNweets = async () => {
    setNweets([]);
    const nweetsFromFS = await firebaseFS
      .collection("nweets")
      .orderBy("createdAt", "asc")
      .get();
    nweetsFromFS.forEach((document) => {
      const { nweet, createdAt, creatorId, id } = document.data();
      setNweets((prev) => [{ nweet, createdAt, creatorId, id }, ...prev]);
    });
  };

  useEffect(() => {
    firebaseFS.collection("nweets").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const { creatorId, nweet, createdAt } = change.doc.data();
          setNweets((prev) => [
            { id: change.doc.id, creatorId, nweet, createdAt },
            ...prev,
          ]);
        }
        if (change.type === "removed") {
          setNweets((prev) =>
            prev.filter((nweet) => nweet.id !== change.doc.id)
          );
        }
        if (change.type === "modified") {
          setNweets((prev) => {
            const index = prev.findIndex((nweet) => {
              return nweet.id === change.doc.id;
            });
            if (index > -1) {
              const { nweet } = change.doc.data();
              prev[index] = { ...prev[index], nweet };
            }

            return [...prev];
          });
        }
      });
    });
  }, []);

  return (
    <div className="w-full flex flex-col max-h-screen overflow-y-scroll">
      <div className="w-full max-w-screen-sm flex flex-col items-start mt-4 mb-4">
        <form className="w-full flex px-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-start w-full mr-2">
            <input
              className="border border-gray-400 py-3 px-2 text-lg w-full outline-none"
              ref={register()}
              name="message"
              type="text"
              placeholder="What's on your mind?"
            />
          </div>
          <button className="mx-auto text-center text-sm px-2 bg-blue-200 text-blue-400 hover:bg-blue-600 hover:text-blue-200 transition duration-200">
            Nweet
          </button>
        </form>
        <div className="mt-4 px-2 w-full">
          {nweets?.length > 0 ? (
            <div>
              {nweets.map((nweet) => (
                <Nweet key={nweet.id} {...nweet} />
              ))}
            </div>
          ) : (
            <div>No Message</div>
          )}
        </div>
      </div>
    </div>
  );
};