# Nwitter

## 1. Setting up

### .env

    - 흥미로운 사실을 하나 알게 되었는데, .env를 react app에서 사용할 때, corss-env 같은 패키지를 설치 하지 않고도 사용할 수 있다.
    - 대신 naminig rule을 따라야 하는데.. REACT_APP_~~~ 이런식으로 작성을 해주면 된다.

## 2. Authentication

### setup.

- 사용하려면 import "firebase/auth"; 해줘야 한다.

### sign in or up

- email 관련해서는 createWithEmailAndPassword, signInWithEmailAndPassword 의 함수등을 사용하는데, 관련 문서 확인하면 될 것 같다.

### setPersistence

- 로그인 관련 정보를 어떻게 저장할지.. react native app 같은 경우에는 local
- 종류는 local, session, none

### isLogged in?

- 처음에 useState로 loggedIn으로 유저 정보를 넘겨 줬는데, 이것이 문제가 뭐냐면...
- firebase가 초기화 되는 시점과 useState가 호출되는 시점이 다르기 때문에, 그래서
- firebase.auth 의 onAuthStateChanged 이벤트 리스너를 활용하면 괜찮다.
- 에러 관련해서는 try catch 를 이용하여 error message를 캐하면 된다.

### signInWithPopup or signInWithRedirect

- 이름에서 쉽게 추측가능.

### social login

- 너무나 쉽다.

## 3.Database

### console.firebase.google.com에 가서 데이터 베이스 먼저 생성

- No SQL database
- collection sql의 테이블 같은 개념?

### onSnapshot => db change observing.

- nico 강의보다 그냥 공식 문서 검색해서... 해결했음.
  https://firebase.google.com/docs/firestore/
  query-data/listen

## 4. File Upload

### 1) handling file

- handling file on vanilla js/html is first time.

```ts
const onFileChange = () => {
  const { files } = getValues();
  const file = files[0];

  const reader = new FileReader();
  // @ts-ignore
  reader.onloadend = (ev) => setImageData(ev.currentTarget.result);
  reader.readAsDataURL(file);
};
```

- currentTarget.result는 img src로도 사용할 수 있다. string data이지만, 브라우저는 알아서 이미지로 해석할 수 있다.

### 2) Firebase Storage

- database처럼 먼저 reference를 만들고 나서 데이터를 보내주면 된다.

#### 1> Reference

- 사용하려면 reference를 이용해야 한다.
  > firebaseStorage.ref()

#### 2> child

> firebaseStorage.ref().child(path)

- collection과 사용방법이 굉장히 비슷하다.

#### 3> example

> const fileRef = firebaseStorage.ref().child(`${firebaseAuth.currentUser?.uid}/${uuidv4()}`);

#### 4> Data put,

- upload는 없고 put이나 putString method가 있다.

## 5. Profile

### 1) Where

```ts
firebaseFS
  .collection("nweets")
  .where("creatorId", "==", firebaseAuth.currentUser?.uid)
  .orderBy("createdAt", "asc");
```

위의 코드는 에러가 발생한다.
no sql 기반이라서 그런다고 하는데... The query required an index.
이런 에러가 나온다.
