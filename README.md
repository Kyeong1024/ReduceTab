# Reduce Tab

## 목차

- [Reudce Tab이란](#reduce-tab)
- [Chrome Extensions 배포 사이트](#chrome-extension-url)
- [설치 및 시작방법](#설치-및-시작방법)
- [Reduce-Tab을 만들게 된 동기](#reduce-tab을-만들게-된-동기)
- [Reduce-Tab 사용 효과](#reduce-tab-사용효과)
- [Reduce-Tab 사용설명](#reduce-tab-사용설명)

## Reduce Tab

- Reduce Tab은 탭을 자동으로 일원화 시켜주어 관리할 수 있게 도와주는 도구입니다.

## Chrome extension URL

- [Reduce Tab Extension](https://chrome.google.com/webstore/detail/reduce-tab/ddojcdkpfcpomfndebldefeepgndiboi?hl=ko&authuser=0)

## 설치 및 시작방법

```
npm install

npm run start
```

[chrome://extensions](chrome://extensions) dist폴더 업로드

## Reduce Tab을 만들게 된 동기.

![InkedInkedvaco too many tabs_LI](https://user-images.githubusercontent.com/38717176/158215396-64a7c434-f06a-4ea1-9129-d64495cb87ac.jpg)

프로그래밍을 재밌게 배우고 있는 와중 친한 동기가 위와 같이 **tab 수십개**를 띄워 놓고 개발하는 것을 봤습니다. 동기뿐만 아니라 저를 포함해 여럿이서 위와 같은 사진에 동감하였습니다.

그래서 위의 문제를 어떻게 해결할 수 있을까? 라는 생각에서 Reduce Tab을 만들게 되었습니다.

Tab을 많이 띄워놓게 되면 **memory를 많이 소비**하는 것 뿐만 아니라 필요한 **tab을 찾는 것**에서 비효율적입니다. Reduce Tab을 통해 두가지 문제를 해결 할 수 있습니다.

## Reduce Tab 사용효과

1. **메모리 사용 측면**  
   탭 한도를 10개로 놓고 탭(youtube, udemy, slack etc..)을 띄웠을 때를 가정하고 탭이 10개가 되었을때 1개로 줄어들게 됩니다. 아래 사진과 같이 사용 메모리가 줄어듭니다.  
   ![diff](https://user-images.githubusercontent.com/38717176/158220008-8b90b589-61f0-4dc4-ab41-75bca0ea06c8.png)
   10개 기준 : 메모리 1067.1MB -> 282.3MB (784.8MB reduced)

2. **효율적인 탭관리**  
   Tab이 줄어들게 되면 한 개의 페이지에 tab정보들이 리스트로 나열되게 됩니다.  
   줄어들기 이전과 똑같이 삭제가 가능하며 북마크 추가 또한 가능합니다.  
   하나로 합쳐진 페이지에서 탭 정보가 많아 질 것에 대비하여 검색기능이 있어 필요한 탭을 검색할 수 있습니다.

## Reduce Tab 사용설명

**Reduce Tab Control Page**  
![popup](https://user-images.githubusercontent.com/38717176/158220540-438c28e3-1625-4a50-89af-a28ba5382c21.png)

1. Tab 최대 개수를 설정할 수 있습니다. 최소 5 최대 25 입니다. 기본 설정은 8입니다.
2. on/off 스위치를 제공하여 익스텐션 설정에서 관리할 필요없습니다.
3. 검색기능을 제공합니다. 검색은 전 범위 탭에 대해서 검색이 가능합니다.
4. Chart를 제공하여 사용자가 사용하는 사이트 정보의 빈도를 시각적으로 표현합니다.

**Reduce Tap Main Page**
![main](https://user-images.githubusercontent.com/38717176/158220855-52658645-6d32-48c6-a871-e1a1ff5641fe.png)

1. 해당 페이지의 탭정보에 한해 검색기능을 지원합니다.
2. 쓰레기통 버튼을 누르면 체크표시 된 것을 제외하고 삭제됩니다.
3. 별표 표시를 누르면 Reduce Tab 북마크 폴더에 저장됩니다.

Caution: 해당 코드소스 및 아이디어의 경우 무단 배포 변경이 불가능합니다. 문의 사항이 있을 시 개발자한테 문의 바랍니다.

Email: aofldjxm@gmail.com
