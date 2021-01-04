import { Nweet } from "components/Nweet";
import { firebaseAuth, firebaseFS, firebaseStorage } from "firebase.app";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface IMessageForm {
  message: string;
  files: File[];
}

export interface INweet {
  id: string;
  creatorId: string;
  nweet: string;
  createdAt: Date;
  imageUrl?: string | null;
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
  const [imageData, setImageData] = useState<string | null>(null);

  const onSubmit = async () => {
    const { message, files } = getValues();

    let fileName = null;

    if (imageData) {
      fileName = uuidv4();
      const fileRef = firebaseStorage
        .ref()
        .child(`${firebaseAuth.currentUser?.uid}/${fileName}`);
      await fileRef.putString(imageData, "data_url");
    }

    await firebaseFS.collection("nweets").add({
      nweet: message,
      creatorId: firebaseAuth.currentUser?.uid,
      createdAt: Date.now(),
      imageUrl: fileName,
    });

    reset();
    setImageData(null);
  };

  const onFileChange = () => {
    const { files } = getValues();
    const file = files[0];

    const reader = new FileReader();
    // @ts-ignore
    reader.onloadend = (ev) => setImageData(ev.currentTarget.result);
    reader.readAsDataURL(file);
  };

  const getNweets = async () => {
    setNweets([]);
    const nweetsFromFS = await firebaseFS
      .collection("nweets")
      .orderBy("createdAt", "asc")
      .get();
    nweetsFromFS.forEach((document) => {
      const { nweet, createdAt, creatorId, id, imageUrl } = document.data();
      setNweets((prev) => [
        { nweet, createdAt, creatorId, id, imageUrl },
        ...prev,
      ]);
    });
  };

  useEffect(() => {
    firebaseFS
      .collection("nweets")
      //.where("creatorId", "==", firebaseAuth.currentUser?.uid)
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const { creatorId, nweet, createdAt, imageUrl } = change.doc.data();
            setNweets((prev) => [
              { id: change.doc.id, creatorId, nweet, createdAt, imageUrl },
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
        <div className="p-1 w-32 h-32 border border-gray-400 self-center mb-2 flex justify-center items-center">
          {imageData && (
            <img className="w-full h-full" src={imageData} alt="from user" />
          )}
        </div>
        <form
          className="w-full flex flex-col px-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-start w-full mr-2 mb-2">
            <input
              className="border border-gray-400 py-3 px-2 text-lg w-full outline-none"
              ref={register()}
              name="files"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
          </div>
          <div className="w-full flex">
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
          </div>
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
