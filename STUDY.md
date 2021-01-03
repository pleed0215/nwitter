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
