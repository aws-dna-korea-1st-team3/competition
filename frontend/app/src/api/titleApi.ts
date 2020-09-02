import { Title } from "../types"

// https://stackoverflow.com/a/2450976
function shuffle<T>(array: Array<T>) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const pseudoLatency = 500

const cachedRecommendedTitlesIds: {[x:string]: string[]} = {}

export const titleApi = {
  findAll: (): Promise<Title[]> => new Promise(resolve => {
    setTimeout(() => resolve([...titles].reverse()), pseudoLatency)
  }),
  findById: (id: string): Promise<Title> => new Promise((resolve, reject) => {
    setTimeout(() => titlesMappedById[id]
      ? resolve(titlesMappedById[id])
      : reject(Error("non existent title #" + id)), pseudoLatency)
  }),
  getRecommendationByTitleId: (_titleId: string): Promise<Title[]> => {
    const titleIds =  cachedRecommendedTitlesIds[_titleId] || shuffle([...titles].map(t => String(t.id))).slice(0, 6)
    cachedRecommendedTitlesIds[_titleId] = titleIds;
    return Promise.all(titleIds.map(id => titleApi.findById(id)))
  },
  getRecommendationByUsername: (_username: string): Promise<Title[]> => {
    const titleIds =  cachedRecommendedTitlesIds[_username] || shuffle([...titles].map(t => String(t.id))).slice(0, 6)
    cachedRecommendedTitlesIds[_username] = titleIds;
    return Promise.all(titleIds.map(id => titleApi.findById(id)))
  }
}

const titlesMappedById: { [x: string]: Title } = {
  "1":
  {
    "updated": false,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/frogprincess/thumbnail/frogprincess-list-thumbnail-cab04b4a.jpg",
    "lastNumberName": "20호",
    "genres": [
      "로맨스",
      "스토리",
      "판타지"
    ],
    "nextEpisode": {
      "text": "다음 화 업데이트일",
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/1/d-9.jpg"
    },
    "introImageUrls": [
      "https://static.manhwakyung.com/title/frogprincess/thumbnail/frogprincess-intro-38ccb1d0.jpg"
    ],
    "firstNumberName": "창간호",
    "name": "개구리공주",
    "badges": [],
    "coverImageUrl": "https://static.manhwakyung.com/title/frogprincess/thumbnail/frogprincess-cover-545aec3a.png",
    "shortDescription": "카멜레온 사랑이의 마법약 프로젝트",
    "nickname": "frogprincess",
    "notice": "",
    "isbn": "",
    "description": "카멜레온 사랑이의 마법약 프로젝트",
    "likesCount": 0,
    "bgColor": "#BC4599",
    "status": "WORKING",
    "id": 1,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/frogprincess/thumbnail/frogprincess-sub-theme-da7cc721.jpg",
    "createdAt": "2019-08-16T13:48:10.032+09:00",
    "creator": {
      "name": "씨씨",
      "id": 1,
      "profileImageUrl": "https://static.manhwakyung.com/creator/1/profile-9ed2f523-d96d-448d-8126-7b913591d97c.jpg",
      "description": "바쁘고 지치는 일상 속에서 아무 생각 없이 볼 수 있는 만화. 출퇴근길, 등하굣길에 누구나 부담 없이 즐길수 있는 만화. 그런 만화를 보여드리고 싶어요."
    },
    "type": "FULL_TITLE",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/frogprincess/thumbnail/frogprincess-thumbnail-7e609538.jpg"
  }
  ,
  "2":
  {
    "notice": "",
    "nextEpisode": {
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-9.jpg",
      "reservedAt": "2020-09-09T11:55:00.548+09:00"
    },
    "firstNumberName": "창간호",
    "genres": [
      "로맨스",
      "스토리"
    ],
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/5/profile-563ee4b0-4452-494f-a8a7-b69d7a724963.jpg",
      "name": "사또띠",
      "id": 5,
      "description": "디자인, 3D를 배웠지만, 결국 만화를 그리고 있어요. 화려한 연출보다 담백한 이야기를 좋아해요. 공감할 수 있는 일상을 소재로 삼아, 위안과 위로를 건네고 싶어요."
    },
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/endoftheday/thumbnail/endoftheday-thumbnail-c41f56af.jpg",
    "id": 2,
    "isbn": "",
    "coverImageUrl": "https://static.manhwakyung.com/title/endoftheday/thumbnail/endoftheday-cover-eb57ad8a.png",
    "status": "WORKING",
    "likesCount": 0,
    "createdAt": "2019-08-16T13:50:12.047+09:00",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/endoftheday/thumbnail/endoftheday-list-thumbnail-48f0a1f5.jpg",
    "badges": [],
    "shortDescription": "긴 하루 끝에 나누는 그들의 담담한 대화",
    "type": "FULL_TITLE",
    "name": "하루의 끝을 당신과",
    "lastNumberName": "20호",
    "description": "긴 하루 끝에 나누는 그들의 담담한 대화",
    "bgColor": "#485F77",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/endoftheday/thumbnail/endoftheday-intro-700f29b4.jpg"
    ],
    "ageRating": {
      "label": "12세 이용가",
      "type": "AGE_12"
    },
    "updated": false,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/endoftheday/thumbnail/endoftheday-sub-theme-5be24adb.jpg",
    "nickname": "endoftheday"
  }
  ,
  "3":
  {
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "coverImageUrl": "https://static.manhwakyung.com/title/fantasytrip/thumbnail/fantasytrip-cover-b81b1500.png",
    "createdAt": "2019-08-16T13:52:31.48+09:00",
    "bgColor": "#556E57",
    "name": "환상여행",
    "updated": false,
    "introImageUrls": [
      "https://static.manhwakyung.com/title/fantasytrip/thumbnail/fantasytrip-intro-5586e332.jpg"
    ],
    "lastNumberName": "20호",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/fantasytrip/thumbnail/fantasytrip-thumbnail-2887c92b.jpg",
    "notice": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/fantasytrip/thumbnail/fantasytrip-list-thumbnail-6de8b1c3.jpg",
    "isbn": "",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/fantasytrip/thumbnail/fantasytrip-sub-theme-884af32a.jpg",
    "shortDescription": "짧지만 긴 여운의 옴니버스 이야기",
    "firstNumberName": "창간호",
    "genres": [
      "옴니버스",
      "판타지"
    ],
    "nickname": "fantasytrip",
    "id": 3,
    "creator": {
      "description": "책과 영화를 좋아하는 작가 영키터예요. 좋은 책과 영화가 사람들에게 영감과 여운을 주듯, 시간이 지나도 사람들 마음속에 오래 머무는 만화를 만들고 싶어요.",
      "name": "영키터",
      "profileImageUrl": "https://static.manhwakyung.com/creator/7/profile-a80a142f-2a99-4f00-96e9-338a81372fb3.jpg",
      "id": 7
    },
    "description": "짧지만 긴 여운의 옴니버스 이야기",
    "likesCount": 0,
    "status": "CLOSE",
    "type": "FULL_TITLE"
  }
  ,
  "4":
  {
    "notice": "",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/nothingspecial/thumbnail/nothingspecial-thumbnail-1c22f6ff.jpg",
    "isbn": "",
    "coverImageUrl": "https://static.manhwakyung.com/title/nothingspecial/thumbnail/nothingspecial-cover-aedc0782.png",
    "id": 4,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/nothingspecial/thumbnail/nothingspecial-list-thumbnail-cad15c36.jpg",
    "nickname": "nothingspecial",
    "createdAt": "2019-08-16T13:54:39.667+09:00",
    "lastNumberName": "20호",
    "updated": false,
    "introImageUrls": [
      "https://static.manhwakyung.com/title/nothingspecial/thumbnail/nothingspecial-intro-2c0e1e68.jpg"
    ],
    "likesCount": 0,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/nothingspecial/thumbnail/nothingspecial-sub-theme-0c5b81df.jpg",
    "type": "FULL_TITLE",
    "genres": [
      "옴니버스",
      "유머"
    ],
    "firstNumberName": "창간호",
    "status": "CLOSE",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "bgColor": "#23A7A2",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/9/profile-cfe5882b-bb87-4382-96e0-e124f733b94d.png",
      "id": 9,
      "description": "10년 차 일러스트레이터, 이제 시작하는 신인 만화가입니다. SNS에 <일상 만화>와 <무엇이든 그려드립니다>란 주문 제작 만화를 그려요. 소통하며 재밌게 작업하고 싶어요.",
      "name": "키크니"
    },
    "shortDescription": "키크니와 이걸그냥이의 별일 없이 사는 이야기",
    "description": "키크니와 이걸그냥이의 별일 없이 사는 이야기",
    "name": "별일 없이 산다"
  }
  ,
  "5":
  {
    "introImageUrls": [
      "https://static.manhwakyung.com/title/hellobye/thumbnail/hellobye-intro-c5197cbc.jpg"
    ],
    "description": "그해 가을, 너를 떠나보낸 이후의 날들",
    "type": "FULL_TITLE",
    "updated": false,
    "notice": "",
    "genres": [
      "드라마",
      "에피소드"
    ],
    "badges": [],
    "coverImageUrl": "https://static.manhwakyung.com/title/hellobye/thumbnail/hellobye-cover-d050dad4.png",
    "firstNumberName": "창간호",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/10/profile-3b0c8237-0919-4ea5-9cb6-324d5fd4f361.jpg",
      "id": 10,
      "name": "우니피",
      "description": "이야기를 쓰고 그려서 함께 나누고 싶은 작가 우니피예요. 제 그림이 누군가에겐 공감이 되고, 누군가에겐 경험이 되고, 또 누군가에겐 작은 위로가 될 수 있기를 바라요."
    },
    "createdAt": "2019-08-16T13:58:33.385+09:00",
    "bgColor": "#3754AD",
    "nickname": "hellobye",
    "likesCount": 0,
    "lastNumberName": "20호",
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/1/d-9.jpg",
      "text": "다음 화 업데이트일",
      "reservedAt": "2020-09-09T11:55:00.548+09:00"
    },
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/hellobye/thumbnail/hellobye-sub-theme-1a0eb0f6.jpg",
    "isbn": "",
    "shortDescription": "그해 가을, 너를 떠나보낸 이후의 날들",
    "id": 5,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/hellobye/thumbnail/hellobye-list-thumbnail-7a506352.jpg",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/hellobye/thumbnail/hellobye-thumbnail-fd3afda7.jpg",
    "status": "WORKING",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "name": "안녕안녕해"
  }
  ,
  "6":
  {
    "isbn": "",
    "bgColor": "#3095D0",
    "status": "WORKING",
    "name": "직장인 감자",
    "nickname": "potatoelife",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/potatoelife/thumbnail/potatoelife-thumbnail-e7c6dcfb.jpg",
    "createdAt": "2019-08-16T14:00:45.429+09:00",
    "shortDescription": "직장인 감자의 웃픈 좌충우돌 일생기",
    "type": "FULL_TITLE",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "badges": [],
    "genres": [
      "드라마",
      "에피소드",
      "유머"
    ],
    "firstNumberName": "창간호",
    "creator": {
      "description": "어쩌다보니 첫 직장, 첫 단추를 잘못 낀 감자. 평범하지만 평범치 않은 인생. 가슴에 사직서 한 장과 아이스 아메리카노 한 잔 들고 질풍노도의 어른에 대한 이야기를 그려요.",
      "id": 11,
      "name": "감자",
      "profileImageUrl": "https://static.manhwakyung.com/creator/11/profile-2228cf0d-27de-411e-a2dc-8261c03f113d.jpg"
    },
    "likesCount": 0,
    "coverImageUrl": "https://static.manhwakyung.com/title/potatoelife/thumbnail/potatoelife-cover-c7f1c1bf.png",
    "updated": false,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/potatoelife/thumbnail/potatoelife-sub-theme-b89f5737.jpg",
    "id": 6,
    "notice": "",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/potatoelife/thumbnail/potatoelife-intro-e3506a80.jpg"
    ],
    "description": "직장인 감자의 웃픈 좌충우돌 일생기",
    "lastNumberName": "20호",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/potatoelife/thumbnail/potatoelife-list-thumbnail-9822ccc5.jpg",
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-9.jpg",
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "text": "다음 화 업데이트일"
    }
  }
  ,
  "7":
  {
    "genres": [
      "드라마",
      "로맨스",
      "스토리"
    ],
    "introImageUrls": [
      "https://static.manhwakyung.com/title/d-day/thumbnail/d-day-intro-388cf832.jpg"
    ],
    "likesCount": 0,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/d-day/thumbnail/d-day-list-thumbnail-38891fd4.jpg",
    "lastNumberName": "16호",
    "nickname": "d-day",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/13/profile-34418a0c-80ef-45a1-8ec9-0af468540d6e.jpg",
      "name": "오늘",
      "description": "매번 후회하고 걱정하며 살았어요. 하지만 현재에 충실하고, 이 순간을 진심으로 임한다면 더 행복해 질 수 있단 걸 알아요. 제 만화로 인해 독자들도 오늘이 더 행복했음 해요.",
      "id": 13
    },
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/d-day/thumbnail/d-day-sub-theme-d0515cbd.jpg",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/d-day/thumbnail/d-day-thumbnail-9bf6af0f.jpg",
    "isbn": "",
    "shortDescription": "정해진 날짜만큼 연애하는 남자의 이야기",
    "type": "FULL_TITLE",
    "notice": "",
    "firstNumberName": "창간호",
    "createdAt": "2019-08-16T14:02:08.982+09:00",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "updated": false,
    "name": "나의 연애 D-day",
    "status": "CLOSE",
    "id": 7,
    "description": "정해진 날짜만큼 연애하는 남자의 이야기",
    "bgColor": "#F07D6A",
    "coverImageUrl": "https://static.manhwakyung.com/title/d-day/thumbnail/d-day-cover-434bb929.png"
  }
  ,
  "8":
  {
    "coverImageUrl": "https://static.manhwakyung.com/title/andagain/thumbnail/andagain-cover-3273fa7f.png",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/andagain/thumbnail/andagain-sub-theme-760e3ae5.jpg",
    "likesCount": 0,
    "status": "WORKING",
    "createdAt": "2019-08-16T14:07:03.137+09:00",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/andagain/thumbnail/andagain-intro-1cf79f23.jpg"
    ],
    "firstNumberName": "창간호",
    "genres": [
      "스토리",
      "일상"
    ],
    "name": "그리고 또",
    "isbn": "",
    "updated": false,
    "bgColor": "#474747",
    "type": "FULL_TITLE",
    "id": 8,
    "shortDescription": "오늘도 묵묵히 그리는, 오월의 일기",
    "notice": "",
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/3/d-9.jpg",
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "text": "다음 화 업데이트일"
    },
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/andagain/thumbnail/andagain-list-thumbnail-8b236a92.jpg",
    "badges": [],
    "lastNumberName": "20호",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/andagain/thumbnail/andagain-thumbnail-aeba64b1.jpg",
    "description": "오늘도 묵묵히 그리는, 오월의 일기",
    "nickname": "andagain",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/14/profile-1c604c43-a516-4942-a51e-c5683670d6e4.jpg",
      "name": "뜻",
      "id": 14,
      "description": "당연하듯 맞이하고 순식간에 지나가는 일상 속에서 ‘잘’ 살아가고 싶어요. 사람을, 관계를, 세상을 어떻게 바라봐야 할지 끊임없이 고민하며 결국에는 우리 모두 서로를 이해하고 이해받기를 바라요."
    }
  }
  ,
  "9":
  {
    "badges": [],
    "name": "윌슨가의 비밀",
    "likesCount": 0,
    "ageRating": {
      "type": "AGE_15",
      "label": "15세 이용가"
    },
    "introImageUrls": [
      "https://static.manhwakyung.com/title/wilsonfamily/thumbnail/wilsonfamily-intro-ac24afef.jpg"
    ],
    "description": "할아버지가 숨긴 재산의 행방을 찾는 추리극",
    "notice": "",
    "createdAt": "2019-08-16T14:08:44.548+09:00",
    "isbn": "",
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-9.jpg",
      "text": "다음 화 업데이트일",
      "reservedAt": "2020-09-09T11:55:00.548+09:00"
    },
    "lastNumberName": "20호",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/wilsonfamily/thumbnail/wilsonfamily-list-thumbnail-dc722374.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/wilsonfamily/thumbnail/wilsonfamily-sub-theme-a5fab793.jpg",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/wilsonfamily/thumbnail/wilsonfamily-thumbnail-c5312bb5.jpg",
    "shortDescription": "할아버지가 숨긴 재산의 행방을 찾는 추리극",
    "nickname": "wilsonfamily",
    "type": "FULL_TITLE",
    "updated": false,
    "genres": [
      "미스터리",
      "스토리"
    ],
    "firstNumberName": "창간호",
    "id": 9,
    "coverImageUrl": "https://static.manhwakyung.com/title/wilsonfamily/thumbnail/wilsonfamily-cover-4d70c5c1.png",
    "status": "WORKING",
    "bgColor": "#BE5640",
    "creator": {
      "id": 15,
      "name": "MILL2",
      "profileImageUrl": "https://static.manhwakyung.com/creator/15/profile-269c0e04-9ad4-4a0a-a999-27647f7098ef.jpg",
      "description": "<윌슨가의 비밀> 작가 MILL2라고 해요. 첫 작품이라 설렘 반 부담 반으로 임하고 있는데요. 쉽게 읽히며 의미가 있는 만화를 목표로 열심히 작업하려고 해요."
    }
  }
  ,
  "10":
  {
    "type": "FULL_TITLE",
    "creator": {
      "description": "30대 중반, 평범한 회사원으로 살다가 드디어 꿈에 그리던 웹툰 작가가 되었어요. 세상 속 가득한, 뻔하디 뻔한 먹고 사는 이야기를 재미있고 따뜻하게 담아내고자 해요.",
      "id": 17,
      "profileImageUrl": "https://static.manhwakyung.com/creator/17/profile-eaa6dcfe-b399-427b-817a-918da7fd3247.jpg",
      "name": "권경진"
    },
    "nickname": "romancecity",
    "badges": [],
    "isbn": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/romancecity/thumbnail/romancecity-list-thumbnail-dfbac9f3.jpg",
    "lastNumberName": "20호",
    "name": "낭만도시",
    "createdAt": "2019-08-16T14:10:10.288+09:00",
    "likesCount": 0,
    "coverImageUrl": "https://static.manhwakyung.com/title/romancecity/thumbnail/romancecity-cover-af3def01.png",
    "shortDescription": "팍팍한 도시 속 어딘가 있을 낭만을 찾아서",
    "updated": false,
    "genres": [
      "드라마",
      "로맨스",
      "스토리"
    ],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/romancecity/thumbnail/romancecity-thumbnail-9bd4b9ea.jpg",
    "nextEpisode": {
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/1/d-9.jpg"
    },
    "introImageUrls": [
      "https://static.manhwakyung.com/title/romancecity/thumbnail/romancecity-intro-9b6bccd1.jpg"
    ],
    "bgColor": "#663FBB",
    "notice": "",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/romancecity/thumbnail/romancecity-sub-theme-cabff1e1.jpg",
    "status": "WORKING",
    "description": "팍팍한 도시 속 어딘가 있을 낭만을 찾아서",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "id": 10,
    "firstNumberName": "창간호"
  }
  ,
  "11":
  {
    "updated": false,
    "likesCount": 0,
    "description": "아날로그 세상 속 스마트 가족의 적응기",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/catchsight/thumbnail/catchsight-list-thumbnail-12f0e9b1.jpg",
    "shortDescription": "아날로그 세상 속 스마트 가족의 적응기",
    "createdAt": "2019-08-16T14:11:51.982+09:00",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/catchsight/thumbnail/catchsight-thumbnail-fb6cfef5.jpg",
    "bgColor": "#055465",
    "creator": {
      "id": 18,
      "description": "마음이 서늘해질 때 한 켠에서 온기로 오래도록 어루만져 주고 싶어요. 여러분들이 움츠러들지 않도록. 모닥불같은 작품을 그려내고 싶은 작가 수입니다.",
      "name": "이수",
      "profileImageUrl": "https://static.manhwakyung.com/creator/18/profile-485e57a7-ab4b-42e3-a8a1-19ef53fd3b78.jpg"
    },
    "status": "CLOSE",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/catchsight/thumbnail/catchsight-intro-757a2c7c.jpg"
    ],
    "firstNumberName": "창간호",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "lastNumberName": "16호",
    "isbn": "",
    "id": 11,
    "genres": [
      "스토리",
      "판타지"
    ],
    "coverImageUrl": "https://static.manhwakyung.com/title/catchsight/thumbnail/catchsight-cover-021e2869.png",
    "type": "FULL_TITLE",
    "nickname": "catchsight",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "notice": "",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/catchsight/thumbnail/catchsight-sub-theme-353eb029.jpg",
    "name": "눈맞춤"
  }
  ,
  "12":
  {
    "firstNumberName": "창간호",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "shortDescription": "채대리의 그냥 버티는 이야기",
    "nickname": "chaedaeri",
    "type": "FULL_TITLE",
    "creator": {
      "id": 19,
      "profileImageUrl": "https://static.manhwakyung.com/creator/19/profile-9d0f052b-d0c2-4f38-b540-e88a991c0305.jpg",
      "name": "채대리",
      "description": "2010년 3월, 회사생활을 시작했습니다.  틈나는 시간에 낙서를 하다가 얼굴을 하나 그리게 되었습니다. 웃지 않고 무표정한 얼굴이 남 같지 않아 회사생활을 그리게 되었습니다."
    },
    "isbn": "",
    "updated": false,
    "bgColor": "#FBBB38",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/chaedaeri/thumbnail/chaedaeri-intro-b7449632.jpg"
    ],
    "description": "채대리의 그냥 버티는 이야기",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/chaedaeri/thumbnail/chaedaeri-sub-theme-ed865daf.jpg",
    "createdAt": "2019-08-16T14:13:01.8+09:00",
    "likesCount": 0,
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/chaedaeri/thumbnail/chaedaeri-thumbnail-2075428b.jpg",
    "status": "CLOSE",
    "name": "회사원 채대리",
    "genres": [
      "스토리",
      "일상"
    ],
    "notice": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/chaedaeri/thumbnail/chaedaeri-list-thumbnail-954224d4.jpg",
    "id": 12,
    "lastNumberName": "20호",
    "coverImageUrl": "https://static.manhwakyung.com/title/chaedaeri/thumbnail/chaedaeri-cover-13914ffa.png"
  }
  ,
  "13":
  {
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/drawingjob/thumbnail/drawingjob-list-thumbnail-a55a9004.jpg",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/20/profile-e6f98a4d-5d6d-4647-b76c-fa0d66b6d730.jpg",
      "name": "초록뱀",
      "description": "2012년부터 그림을 업으로 삼고 살고 있습니다. 아직은 만화가라는 호칭이 어색하기만 합니다. 기회가 닿는대로 좋은 이야기 보여드리겠습니다.",
      "id": 20
    },
    "introImageUrls": [],
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "status": "CLOSE",
    "type": "SHORT_TITLE",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/drawingjob/thumbnail/drawingjob-thumbnail-f4aaf76f.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/drawingjob/thumbnail/drawingjob-sub-theme-f834a2cb.jpg",
    "genres": [
      "드라마",
      "스토리",
      "일상"
    ],
    "bgColor": "#48b195",
    "id": 13,
    "firstNumberName": "",
    "updated": false,
    "description": "좋아하는 일과 현실사이를 그리는 드라마",
    "name": "그림을 그리는 일",
    "isbn": "",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "nickname": "drawingjob",
    "shortDescription": "좋아하는 일과 현실사이를 그리는 드라마",
    "likesCount": 0,
    "lastNumberName": "",
    "createdAt": "2019-08-16T14:14:47.989+09:00",
    "notice": "",
    "coverImageUrl": ""
  }
  ,
  "14":
  {
    "type": "SHORT_TITLE",
    "status": "CLOSE",
    "likesCount": 0,
    "id": 14,
    "introImageUrls": [],
    "nickname": "marriageclass",
    "name": "결혼교과시간",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "shortDescription": "학교에서 배우는 결혼",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/marriageclass/thumbnail/marriageclass-thumbnail-5e4593ca.jpg",
    "description": "고등학교에 입학한 사양이가 \n결혼이라는 교과를 배우면서 일어나는 신기한 이야기",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/marriageclass/thumbnail/marriageclass-list-thumbnail-d8d2f97f.jpg",
    "firstNumberName": "",
    "lastNumberName": "",
    "updated": false,
    "genres": [
      "드라마",
      "스토리",
      "학원"
    ],
    "notice": "",
    "creator": {
      "name": "한차은",
      "description": "만화를 그리는 한차은입니다.",
      "id": 21,
      "profileImageUrl": "https://static.manhwakyung.com/creator/21/profile-87570794.jpg"
    },
    "bgColor": "#72c097",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/marriageclass/thumbnail/marriageclass-sub-theme-727dfb63.jpg",
    "isbn": "",
    "createdAt": "2019-08-16T14:16:28.712+09:00",
    "coverImageUrl": ""
  }
  ,
  "15":
  {
    "firstNumberName": "",
    "nickname": "nonstopsubway",
    "lastNumberName": "",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "genres": [
      "스토리",
      "일상",
      "판타지"
    ],
    "coverImageUrl": "",
    "status": "CLOSE",
    "name": "논스톱 서브웨이",
    "shortDescription": "일상 속 누군가의 판타지",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/nonstopsubway/thumbnail/nonstopsubway-thumbnail-512e01db.jpg",
    "description": "일상 속 누군가의 판타지",
    "notice": "",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "updated": false,
    "isbn": "",
    "bgColor": "#442161",
    "type": "SHORT_TITLE",
    "id": 15,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/nonstopsubway/thumbnail/nonstopsubway-list-thumbnail-11c9a850.jpg",
    "introImageUrls": [],
    "likesCount": 0,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/nonstopsubway/thumbnail/nonstopsubway-sub-theme-d613cdfb.jpg",
    "createdAt": "2019-09-04T13:47:18.891+09:00",
    "creator": {
      "id": 23,
      "profileImageUrl": "https://static.manhwakyung.com/creator/23/profile-1df19c8d-ac57-4c51-aa08-e37964ef6455.jpg",
      "description": "안녕하세요. 만화경에서 단편만화 <논스톱 서브웨이>를 그렸던 모 입니다:)",
      "name": "모"
    }
  }
  ,
  "16":
  {
    "status": "CLOSE",
    "lastNumberName": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/aroundoftown/thumbnail/aroundoftown-list-thumbnail-05756584.jpg",
    "name": "동네 한 바퀴",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "coverImageUrl": "",
    "introImageUrls": [],
    "id": 16,
    "genres": [
      "드라마",
      "스토리",
      "일상"
    ],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/aroundoftown/thumbnail/aroundoftown-thumbnail-5e6b6b88.jpg",
    "bgColor": "#97CAFF",
    "isbn": "",
    "updated": false,
    "nickname": "aroundoftown",
    "likesCount": 0,
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "type": "SHORT_TITLE",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/aroundoftown/thumbnail/aroundoftown-sub-theme-e5e7fcd4.jpg",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/24/profile-0438c4cb.jpg",
      "name": "박우진",
      "id": 24,
      "description": "안녕하세요. 박우진 작가입니다. 잘 부탁드립니다."
    },
    "firstNumberName": "",
    "shortDescription": "동네 안, 우리들의 이야기",
    "createdAt": "2019-10-02T15:02:44.186+09:00",
    "notice": "",
    "description": "동네 안의 불특정한 사람들의 사연이 있는 이야기입니다. \n나의 이야기일 수도, 아님 주변의 이야기일 수도 있는 \n여러 관계의 감정에 대해서  표현하고 공감시키고자 합니다."
  }
  ,
  "17":
  {
    "description": "러블리한 동거를 꿈꾸며 토종닭 두 마리를 데려온 뿌리 엄마. \n하지만 현실은 도착과 동시에 한 바탕 대소동이 펼쳐집니다!\n실화를 바탕으로 한 가족 코믹 이야기.",
    "notice": "",
    "updated": false,
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "firstNumberName": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/chickencomics/thumbnail/chickencomics-list-thumbnail-81b9e341.jpg",
    "creator": {
      "description": "18년 동안 아이들을 위한 애니메이션을 만들었다. 아이가 태어난 이후에는 sns에 가족 이야기를 담은 '뿌리네 이야기'를 그렸다. 현재 동물 드로잉 노트를 집필 중이다.",
      "id": 25,
      "profileImageUrl": "https://static.manhwakyung.com/creator/25/profile-798b17aa.jpg",
      "name": "이리건"
    },
    "createdAt": "2019-10-31T16:15:27.155+09:00",
    "likesCount": 0,
    "id": 17,
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/chickencomics/thumbnail/chickencomics-thumbnail-75d0c843.jpg",
    "bgColor": "#f1682b",
    "status": "CLOSE",
    "name": "꼬꼬댁 대소동",
    "introImageUrls": [],
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/chickencomics/thumbnail/chickencomics-sub-theme-83e786cf.jpg",
    "isbn": "",
    "coverImageUrl": "",
    "nickname": "chickencomics",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "genres": [
      "에피소드",
      "유머"
    ],
    "type": "SHORT_TITLE",
    "lastNumberName": "",
    "shortDescription": "실화를 바탕으로 한 가족 코믹 이야기"
  }
  ,
  "18":
  {
    "updated": false,
    "lastNumberName": "",
    "isbn": "",
    "nickname": "fairyring",
    "firstNumberName": "",
    "creator": {
      "id": 26,
      "profileImageUrl": "https://static.manhwakyung.com/creator/26/profile-b76a7901.jpg",
      "description": "평범한 순간들 속에 존재하는 특별한 빛을 찾고 있습니다.",
      "name": "가원"
    },
    "coverImageUrl": "",
    "status": "CLOSE",
    "notice": "",
    "type": "SHORT_TITLE",
    "bgColor": "#cdda89",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/fairyring/thumbnail/fairyring-thumbnail-223396cc.jpg",
    "likesCount": 0,
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "introImageUrls": [],
    "createdAt": "2019-12-05T16:10:55.522+09:00",
    "shortDescription": "두 사람과 관련된 독버섯 설화",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/fairyring/thumbnail/fairyring-list-thumbnail-d623ce8f.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/fairyring/thumbnail/fairyring-sub-theme-61f38535.jpg",
    "name": "페어리링",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "description": "독버섯이 생겨나게 된 설화와 그에 관련된 두 사람의 이야기",
    "id": 18,
    "genres": [
      "드라마",
      "미스터리",
      "판타지"
    ]
  }
  ,
  "19":
  {
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/didntlivetoday/thumbnail/didntlivetoday-thumbnail-73e0d720.jpg",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "lastNumberName": "20호",
    "nextEpisode": {
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-9.jpg",
      "text": "다음 화 업데이트일"
    },
    "nickname": "didntlivetoday",
    "creator": {
      "id": 21,
      "description": "만화를 그리는 한차은입니다.",
      "name": "한차은",
      "profileImageUrl": "https://static.manhwakyung.com/creator/21/profile-87570794.jpg"
    },
    "type": "FULL_TITLE",
    "bgColor": "#f0c255",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/didntlivetoday/thumbnail/didntlivetoday-list-thumbnail-b627c08f.jpg",
    "description": "오늘이 설레는 날이 올까?",
    "name": "오늘을 살아본 게 아니잖아",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/didntlivetoday/thumbnail/didntlivetoday-intro-87448d92.jpg"
    ],
    "genres": [
      "드라마",
      "일상",
      "판타지"
    ],
    "badges": [],
    "shortDescription": "오늘이 설레는 날이 올까?",
    "firstNumberName": "9호",
    "likesCount": 0,
    "updated": false,
    "notice": "",
    "id": 19,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/didntlivetoday/thumbnail/didntlivetoday-sub-theme-e6dfc656.jpg",
    "isbn": "",
    "coverImageUrl": "https://static.manhwakyung.com/title/didntlivetoday/thumbnail/didntlivetoday-cover-0fd1fa0f.png",
    "createdAt": "2019-12-31T10:40:15.459+09:00",
    "status": "WORKING"
  }
  ,
  "20":
  {
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/052/thumbnail/052-thumbnail-19ac5a54.jpg",
    "status": "CLOSE",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "id": 20,
    "firstNumberName": "",
    "bgColor": "#85b6ff",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/052/thumbnail/052-sub-theme-17d3be89.jpg",
    "updated": false,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/052/thumbnail/052-list-thumbnail-009c4eac.jpg",
    "likesCount": 0,
    "lastNumberName": "",
    "createdAt": "2019-12-31T12:27:16.111+09:00",
    "notice": "",
    "coverImageUrl": "",
    "name": "섬의 봄",
    "nickname": "052",
    "isbn": "",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "shortDescription": "관리로봇 봄이와 하루의 이야기",
    "description": "모두가 떠난 무인도. 섬의 관리로봇  '봄'이와\n봄의 관리자 '하루'의 관계에 대한 이야기.",
    "type": "SHORT_TITLE",
    "introImageUrls": [],
    "creator": {
      "name": "052",
      "profileImageUrl": "https://static.manhwakyung.com/creator/27/profile-0cf92180.jpg",
      "id": 27,
      "description": "안녕하세요. 052입니다. 만화를 통해서 친절함과 따뜻함을 전하고 싶습니다."
    },
    "genres": [
      "드라마",
      "스토리",
      "일상"
    ]
  }
  ,
  "21":
  {
    "name": "Return",
    "isbn": "",
    "lastNumberName": "",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/return/thumbnail/return-sub-theme-1f1e8e9e.jpg",
    "type": "SHORT_TITLE",
    "status": "CLOSE",
    "description": "대학 졸업반인 주인공은 홀로 유학을 떠난다. \n나름의 계획대로 유학생활을  버티지만 뜻밖의 문제들과 조우한다.  \n현실과 선택, 그에 대한 책임에 대해 고민하며 성숙해져 간다.",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/return/thumbnail/return-thumbnail-6696431d.jpg",
    "likesCount": 0,
    "bgColor": "#bbc8cc",
    "coverImageUrl": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/return/thumbnail/return-list-thumbnail-88ff6ede.jpg",
    "updated": false,
    "introImageUrls": [],
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "notice": "",
    "shortDescription": "청춘의 흔들림에 관한 이야기",
    "genres": [
      "드라마",
      "일상"
    ],
    "id": 21,
    "creator": {
      "name": "전희성",
      "description": "안녕하세요. 전희성 작가입니다.",
      "id": 30,
      "profileImageUrl": "https://static.manhwakyung.com/creator/30/profile-930df093.jpg"
    },
    "firstNumberName": "",
    "nickname": "return",
    "ageRating": {
      "label": "12세 이용가",
      "type": "AGE_12"
    },
    "createdAt": "2020-02-04T16:02:14.475+09:00"
  }
  ,
  "22":
  {
    "genres": [
      "유머",
      "일상",
      "판타지"
    ],
    "updated": false,
    "id": 22,
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/openmagicalmacaron/thumbnail/openmagicalmacaron-thumbnail-1bf1ca59.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/openmagicalmacaron/thumbnail/openmagicalmacaron-sub-theme-002-50a2493f.jpg",
    "description": "마카롱 가게를 오픈했지만 찾아오는 손님들은 모두 이세계 손님들뿐! \n다양한 주민들로 인해 마카롱 가게는 조용한 날이 없는데…",
    "notice": "",
    "nickname": "openmagicalmacaron",
    "shortDescription": "마카롱 가게에서 생기는 다양한 이야기들",
    "isbn": "",
    "createdAt": "2020-02-11T18:59:40.848+09:00",
    "name": "오픈했어요 매직컬 마카롱",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/31/profile-2161ed15.jpg",
      "name": "JE",
      "description": "-",
      "id": 31
    },
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/openmagicalmacaron/thumbnail/openmagicalmacaron-list-thumbnail-aa578be9.jpg",
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/1/d-9.jpg",
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "text": "다음 화 업데이트일"
    },
    "bgColor": "#af89ff",
    "type": "FULL_TITLE",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "coverImageUrl": "https://static.manhwakyung.com/title/openmagicalmacaron/thumbnail/openmagicalmacaron-cover-db1222b2.png",
    "likesCount": 0,
    "introImageUrls": [
      "https://static.manhwakyung.com/title/openmagicalmacaron/thumbnail/openmagicalmacaron-intro-56c97c8e.jpg"
    ],
    "firstNumberName": "12호",
    "badges": [],
    "status": "WORKING",
    "lastNumberName": "20호"
  }
  ,
  "23":
  {
    "ageRating": {
      "label": "12세 이용가",
      "type": "AGE_12"
    },
    "name": "Winter Game",
    "createdAt": "2020-02-25T10:32:03.051+09:00",
    "likesCount": 0,
    "introImageUrls": [
      "https://static.manhwakyung.com/title/wintergame/thumbnail/wintergame-intro-4b93697f.jpg"
    ],
    "status": "WORKING",
    "id": 23,
    "shortDescription": "혼자 남은 스라소니 '파이'의 생존기",
    "notice": "",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/wintergame/thumbnail/wintergame-thumbnail-86275019.jpg",
    "badges": [],
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/wintergame/thumbnail/wintergame-list-thumbnail-16a58d8b.jpg",
    "nickname": "wintergame",
    "nextEpisode": {
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-9.jpg",
      "reservedAt": "2020-09-09T11:55:00.548+09:00"
    },
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/wintergame/thumbnail/wintergame-sub-theme-9e6d1ecf.jpg",
    "genres": [
      "드라마",
      "스토리"
    ],
    "coverImageUrl": "https://static.manhwakyung.com/title/wintergame/thumbnail/wintergame-cover-fea73d90.png",
    "isbn": "",
    "updated": false,
    "description": "극동의 시베리아, 가족을 잃은 스라소니 '파이'와 동생 '코바'는 \n야생에서 살아남을수 있을까?",
    "firstNumberName": "13호",
    "bgColor": "#5d6777",
    "creator": {
      "id": 32,
      "profileImageUrl": "https://static.manhwakyung.com/creator/32/profile-062d48c7.jpg",
      "description": "안녕하세요. 고제형입니다.",
      "name": "고제형"
    },
    "type": "FULL_TITLE",
    "lastNumberName": "20호"
  }
  ,
  "24":
  {
    "firstNumberName": "",
    "name": "이웃집 남녀 in 교토",
    "nickname": "myneighboringhouse",
    "updated": false,
    "introImageUrls": [],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/myneighboringhouse/thumbnail/myneighboringhouse-thumbnail-a256a7dc.jpg",
    "description": "일본 교토의 작은 시골 마을. \n같은 멘션에 살고 있는 한국인 유학생 남자와 일본인 여자가 \n서로 부딪히며 각자의 아픔을 극복해 나가는 성장 로맨스.",
    "lastNumberName": "",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/myneighboringhouse/thumbnail/myneighboringhouse-sub-theme-d85e5b45.jpg",
    "coverImageUrl": "",
    "shortDescription": "국적 다른 남녀의 성장로맨스",
    "id": 24,
    "isbn": "",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/33/profile-4aee48d4.jpg",
      "description": "일본 교토세이카 대학에서 애니메이션을 전공하고 일본에서의 경험과 한국에서의 경험을 바탕으로 느꼈던 감정을 기반으로 웹툰작품을 그리는중입니다.",
      "id": 33,
      "name": "효빗"
    },
    "bgColor": "#f26cc3",
    "genres": [
      "드라마",
      "로맨스",
      "유머"
    ],
    "type": "SHORT_TITLE",
    "createdAt": "2020-03-03T14:59:07.164+09:00",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "status": "CLOSE",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/myneighboringhouse/thumbnail/myneighboringhouse-list-thumbnail-92e2fb8e.jpg",
    "notice": "",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "likesCount": 0
  }
  ,
  "25":
  {
    "lastNumberName": "",
    "nickname": "mykiller",
    "genres": [
      "소년물",
      "스토리"
    ],
    "description": "더스터넌트에 살고 있는 킬러 '오웬'. \n어느 날, 그에게 한 소녀를 살해해달라는 의뢰가 들어오고. \n오웬은 소녀를 노리는 킬러가 자신만이 아니란 걸 알게 되는데...!",
    "coverImageUrl": "",
    "bgColor": "#aa1a1a",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/mykiller/thumbnail/mykiller-list-thumbnail-e592e3a2.jpg",
    "id": 25,
    "createdAt": "2020-03-17T17:36:03.655+09:00",
    "ageRating": {
      "label": "15세 이용가",
      "type": "AGE_15"
    },
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/34/profile-d856e9d2.jpg",
      "id": 34,
      "description": "<MY KILLER>를 처음으로 웹툰 작가를 하게 된, 토토마쉬입니다. <MY KILLER>부터 그 후에 작업들도 재밌는 캐릭터들이 많이 나오는 만화를 그려보고 싶어요.",
      "name": "토토마쉬"
    },
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/mykiller/thumbnail/mykiller-thumbnail-b92290c0.jpg",
    "introImageUrls": [],
    "firstNumberName": "",
    "name": "My Killer",
    "isbn": "",
    "shortDescription": "여러 명의 킬러가 한 타깃을 노리게 된다면?!",
    "likesCount": 0,
    "notice": "",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/mykiller/thumbnail/mykiller-sub-theme-53215cf2.jpg",
    "status": "CLOSE",
    "updated": false,
    "type": "SHORT_TITLE"
  }
  ,
  "26":
  {
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/heartsong/thumbnail/heartsong-list-thumbnail-7fc6e075.jpg",
    "badges": [],
    "description": "가사에 따라 감정이 폭발해 1절조차 제대로 부르기 힘든 \n신인밴드 '포커페이스'의 보컬 '구원'. 어느 날 별안간 나타난 \n의문의 할아버지에 의해 2200년 미래로 가게 되는데..",
    "creator": {
      "description": "“만약 오후 4시에 네가 온다면, 나는 3시부터 행복해지기 시작할 거야.” 소설 어린왕자에서 나왔던 대사 중 가장 인상이 깊었던 대사인데요 저에게 있어선 데이트, 치킨, 영화, 신곡, 복권 추첨(^^;)을 기다리는 시간이 그러합니다. 여러분이 기다리는 시간마저 행복할 정도의 매력이 있는 만화를 만들고 싶습니다.",
      "id": 35,
      "profileImageUrl": "https://static.manhwakyung.com/creator/35/profile-37b02ab8.jpg",
      "name": "Hwoo, Jin"
    },
    "coverImageUrl": "https://static.manhwakyung.com/title/heartsong/thumbnail/heartsong-cover-31a54b05.png",
    "status": "WORKING",
    "notice": "",
    "bgColor": "#d5cbc8",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "name": "가슴으로 들어요",
    "firstNumberName": "15호",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/heartsong/thumbnail/heartsong-intro-ed777cf0.jpg"
    ],
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-9.jpg",
      "text": "다음 화 업데이트일",
      "reservedAt": "2020-09-09T11:55:00.548+09:00"
    },
    "shortDescription": "감정을 잃은 잿빛 세상, 음악으로 물들이다.",
    "createdAt": "2020-03-19T14:09:23.759+09:00",
    "id": 26,
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/heartsong/thumbnail/heartsong-thumbnail-cf04b5ce.jpg",
    "nickname": "heartsong",
    "lastNumberName": "20호",
    "genres": [
      "드라마",
      "판타지"
    ],
    "isbn": "",
    "likesCount": 0,
    "type": "FULL_TITLE",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/heartsong/thumbnail/heartsong-sub-theme-df62c37b.jpg",
    "updated": false
  }
  ,
  "27":
  {
    "coverImageUrl": "",
    "likesCount": 0,
    "bgColor": "#ffa649",
    "creator": {
      "name": "만화경편집부",
      "id": 36,
      "profileImageUrl": "https://static.manhwakyung.com/creator/36/profile-c33abcb0.jpg",
      "description": "안녕하세요. 만화경편집부 입니다."
    },
    "nickname": "c9th",
    "description": "오늘도 즐거운 만화경 편집부의 뒷이야기",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/c9th/thumbnail/c9th-thumbnail-ba2a95a1.jpg",
    "id": 27,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/c9th/thumbnail/c9th-sub-theme-001-7cfe7a6c.jpg",
    "status": "CLOSE",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "genres": [
      "옴니버스",
      "유머",
      "일상"
    ],
    "name": "만화경 편집부는 9층입니다",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "shortDescription": "만화경 편집자들 뒷이야기",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/c9th/thumbnail/c9th-list-thumbnail-7741fa6e.jpg",
    "lastNumberName": "",
    "firstNumberName": "",
    "type": "FULL_TITLE",
    "introImageUrls": [],
    "isbn": "",
    "updated": false,
    "notice": "",
    "createdAt": "2020-03-30T14:07:19.402+09:00"
  }
  ,
  "28":
  {
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/retirechef/thumbnail/retirechef-thumbnail-707cabc3.jpg",
    "nickname": "retirechef",
    "description": "50년 주방생활을 한 보통의 어머니, 호순이 있습니다. \n평생 식당에서 일만 했지 손님은 되어본 적이 없는 그녀는 \n주방생활 은퇴를 앞두고 용기를 내봅니다.",
    "lastNumberName": "",
    "creator": {
      "id": 37,
      "profileImageUrl": "https://static.manhwakyung.com/creator/37/profile-531e02f8.jpg",
      "description": "안녕하세요. 재주 작가입니다.",
      "name": "재주"
    },
    "bgColor": "#ffdf65",
    "id": 28,
    "updated": false,
    "firstNumberName": "",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "type": "SHORT_TITLE",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "notice": "",
    "status": "CLOSE",
    "isbn": "",
    "introImageUrls": [],
    "coverImageUrl": "",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/retirechef/thumbnail/retirechef-sub-theme-1fa3dc34.jpg",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/retirechef/thumbnail/retirechef-list-thumbnail-0e7b962f.jpg",
    "shortDescription": "처음 손님이 되어본 요리사",
    "createdAt": "2020-04-01T18:59:15.407+09:00",
    "likesCount": 0,
    "genres": [
      "드라마",
      "에피소드",
      "일상"
    ],
    "name": "은퇴 요리사"
  }
  ,
  "29":
  {
    "description": "후각+미각이 발달한 장점을 살려 상분직 어의가 된 '수양'. \n고운 외모가 무색한 직업(?)에 매일 한탄을 한다. \n그러던 어느 날, 매화에서 미약한 독약의 기운을 느끼게 되는데!",
    "firstNumberName": "16호",
    "name": "매화꽃이 피었나이다",
    "nextEpisode": {
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/3/d-9.jpg"
    },
    "bgColor": "#ffbcb7",
    "shortDescription": "얼굴 천재 어의의 험난한 궁궐 생존기",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/plumblossom/thumbnail/plumblossom-list-thumbnail-e888c391.jpg",
    "notice": "",
    "id": 29,
    "likesCount": 0,
    "updated": false,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/plumblossom/thumbnail/plumblossom-sub-theme-473e171e.jpg",
    "badges": [],
    "coverImageUrl": "https://static.manhwakyung.com/title/plumblossom/thumbnail/plumblossom-cover-e46b8bb1.png",
    "creator": {
      "name": "파랑",
      "description": "하고 싶은 건 많으나 몸이 따라와 주지 않는 인간 입니다. 커피를 좋아하고요. 좋아합니다. 언제나 재밌는 만화를 만들고 싶습니다.",
      "profileImageUrl": "https://static.manhwakyung.com/creator/38/profile-da288a25.jpg",
      "id": 38
    },
    "status": "WORKING",
    "nickname": "plumblossom",
    "genres": [
      "에피소드",
      "유머"
    ],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/plumblossom/thumbnail/plumblossom-thumbnail-c92d02e6.jpg",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "lastNumberName": "20호",
    "type": "FULL_TITLE",
    "isbn": "",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/plumblossom/thumbnail/plumblossom-intro-78ef27d0.png"
    ],
    "createdAt": "2020-04-07T12:58:37.185+09:00"
  }
  ,
  "30":
  {
    "name": "너의 행성 B126으로",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/planetb126/thumbnail/planetb126-sub-theme-a6d3726e.jpg",
    "bgColor": "#a957c8",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/planetb126/thumbnail/planetb126-list-thumbnail-b09112cc.jpg",
    "isbn": "",
    "notice": "",
    "lastNumberName": "",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "creator": {
      "id": 39,
      "profileImageUrl": "https://static.manhwakyung.com/creator/39/profile-5bd9cc35.jpg",
      "name": "ㅎㅂㅆ",
      "description": "안녕하세요. ㅎㅂㅆ 작가입니다."
    },
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/planetb126/thumbnail/planetb126-thumbnail-363240ba.jpg",
    "status": "CLOSE",
    "shortDescription": "그가 그의 행성으로 달리기 시작했다",
    "createdAt": "2020-04-09T17:28:29.455+09:00",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "updated": false,
    "description": "참고, 미루지마. 지금 달려가. \n네가 사랑하는 장미꽃이 가득 피어있는 너의 행성, B126으로.",
    "nickname": "planetb126",
    "type": "SHORT_TITLE",
    "firstNumberName": "",
    "coverImageUrl": "",
    "likesCount": 0,
    "introImageUrls": [],
    "genres": [
      "드라마",
      "스토리",
      "일상"
    ],
    "id": 30
  }
  ,
  "31":
  {
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/goodhusband/thumbnail/goodhusband-thumbnail-b6a06d57.jpg",
    "shortDescription": "임신, 출산 과정을 겪는 부부의 성장 드라마",
    "introImageUrls": [],
    "isbn": "",
    "name": "좋은 남편",
    "notice": "",
    "createdAt": "2020-04-29T12:58:18.141+09:00",
    "likesCount": 0,
    "coverImageUrl": "",
    "status": "CLOSE",
    "genres": [
      "드라마",
      "스토리",
      "일상"
    ],
    "updated": false,
    "type": "SHORT_TITLE",
    "description": "주인공 철수가 아내의 임신과 출산 과정을 함께 겪으며 \n서로에 대해 좀 더 깊이 이해하고 삶의 변화를 받아들이는 \n성장 드라마",
    "firstNumberName": "",
    "ageRating": {
      "label": "12세 이용가",
      "type": "AGE_12"
    },
    "creator": {
      "description": "2012년부터 그림을 업으로 삼고 살고 있습니다. 아직은 만화가라는 호칭이 어색하기만 합니다. 기회가 닿는대로 좋은 이야기 보여드리겠습니다.",
      "name": "초록뱀",
      "id": 20,
      "profileImageUrl": "https://static.manhwakyung.com/creator/20/profile-e6f98a4d-5d6d-4647-b76c-fa0d66b6d730.jpg"
    },
    "lastNumberName": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/goodhusband/thumbnail/goodhusband-list-thumbnail-37e9cf7a.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/goodhusband/thumbnail/goodhusband-sub-theme-001-eda4aaba.jpg",
    "nickname": "goodhusband",
    "id": 31,
    "bgColor": "#0082be"
  }
  ,
  "32":
  {
    "type": "FULL_TITLE",
    "nickname": "family-comic",
    "coverImageUrl": "https://static.manhwakyung.com/title/family-comic/thumbnail/family-comic-cover-493ab217.png",
    "name": "뿌리네 이야기",
    "shortDescription": "엉뚱하고 귀여운 뿌리와 함께하는 야생 정글 육아 이야기",
    "likesCount": 0,
    "bgColor": "#d9724a",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/family-comic/thumbnail/family-comic-intro-86990479.jpg"
    ],
    "creator": {
      "description": "18년 동안 아이들을 위한 애니메이션을 만들었다. 아이가 태어난 이후에는 sns에 가족 이야기를 담은 '뿌리네 이야기'를 그렸다. 현재 동물 드로잉 노트를 집필 중이다.",
      "name": "이리건",
      "profileImageUrl": "https://static.manhwakyung.com/creator/25/profile-798b17aa.jpg",
      "id": 25
    },
    "nextEpisode": {
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/1/d-9.jpg"
    },
    "badges": [],
    "isbn": "",
    "lastNumberName": "20호",
    "id": 32,
    "updated": false,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/family-comic/thumbnail/family-comic-sub-theme-bc9ce419.jpg",
    "status": "WORKING",
    "createdAt": "2020-05-04T19:22:30.226+09:00",
    "notice": "",
    "description": "집 밖이 무서운 지박령 아빠와 매일 무한도전 중인 덤벙이 엄마, \n귀엽고 엉뚱한 뿌리의 모험 같은 일상.",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/family-comic/thumbnail/family-comic-list-thumbnail-f4580102.jpg",
    "genres": [
      "유머",
      "일상",
      "판타지"
    ],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/family-comic/thumbnail/family-comic-thumbnail-b3884781.jpg",
    "firstNumberName": "18호",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    }
  }
  ,
  "33":
  {
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/gagavirus/thumbnail/gagavirus-sub-theme-cb5752a9.jpg",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "genres": [
      "미스터리",
      "스토리",
      "판타지"
    ],
    "bgColor": "#ff836c",
    "creator": {
      "id": 40,
      "profileImageUrl": "https://static.manhwakyung.com/creator/40/profile-9897bae7.jpg",
      "name": "김마토",
      "description": "안녕하세요. 김마토 작가입니다."
    },
    "firstNumberName": "",
    "introImageUrls": [],
    "notice": "",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/gagavirus/thumbnail/gagavirus-thumbnail-b5b74f11.jpg",
    "status": "CLOSE",
    "id": 33,
    "createdAt": "2020-05-13T07:58:12.759+09:00",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "isbn": "",
    "type": "SHORT_TITLE",
    "coverImageUrl": "",
    "name": "가가바이러스",
    "shortDescription": "신비롭고 미스터리한 짝사랑 바이러스 이야기",
    "likesCount": 0,
    "description": "어느 날, 분홍띠 별에 미스터리한 바이러스가 퍼진다. \n감염된 사람들은 별 전체를 감싸듯 일렬로 줄을 서서 이상 행동을 보인다. 이를 해결하기 위해서 나선 어스 팀.",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/gagavirus/thumbnail/gagavirus-list-thumbnail-b8fe2af9.jpg",
    "updated": false,
    "lastNumberName": "",
    "nickname": "gagavirus"
  }
  ,
  "34":
  {
    "notice": "",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/storyofscrew/thumbnail/storyofscrew-sub-theme-62bdc5bf.jpg",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/41/profile-50fd510b.jpg",
      "id": 41,
      "name": "김브로",
      "description": "안녕하세요. 웹툰 만드는 김브로입니다. 여운이 남는 웹툰 제작을 목표로 합니다. 잘 부탁드립니다."
    },
    "firstNumberName": "19호",
    "badges": [],
    "status": "WORKING",
    "name": "나사들의 이야기",
    "bgColor": "#ed9574",
    "nextEpisode": {
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-9.jpg"
    },
    "nickname": "storyofscrew",
    "updated": false,
    "shortDescription": "너와 나 그리고 우리의 옴니버스 드라마",
    "coverImageUrl": "https://static.manhwakyung.com/title/storyofscrew/thumbnail/storyofscrew-cover-d35d2570.png",
    "createdAt": "2020-05-19T09:32:39.626+09:00",
    "lastNumberName": "20호",
    "type": "FULL_TITLE",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/storyofscrew/thumbnail/storyofscrew-intro-b5b80715.jpg"
    ],
    "genres": [
      "드라마",
      "옴니버스",
      "판타지"
    ],
    "isbn": "",
    "ageRating": {
      "type": "AGE_12",
      "label": "12세 이용가"
    },
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/storyofscrew/thumbnail/storyofscrew-thumbnail-30f2738e.jpg",
    "likesCount": 0,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/storyofscrew/thumbnail/storyofscrew-list-thumbnail-098cc149.jpg",
    "description": "말하고 쓰여지지 않으면 증발해버릴 각자의 드라마들을 이야기하며\n기계 부속 같은 차가움과 고독을 견디며 사는 개인들에게\n조금이나마 위안을 건네고자 한다.",
    "id": 34
  }
  ,
  "35":
  {
    "nextEpisode": {
      "reservedAt": "2020-09-09T11:55:00.548+09:00",
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/1/d-9.jpg"
    },
    "bgColor": "#e8d078",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "introImageUrls": [
      "https://static.manhwakyung.com/title/joseonrockstar/thumbnail/joseonrockstar-intro-1eded970.png"
    ],
    "createdAt": "2020-06-02T10:40:26.292+09:00",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/joseonrockstar/thumbnail/joseonrockstar-thumbnail-499b587b.jpg",
    "status": "WORKING",
    "firstNumberName": "20호",
    "isbn": "",
    "shortDescription": "조선시대 최초의 록 그룹 탄생 이야기",
    "nickname": "joseonrockstar",
    "lastNumberName": "20호",
    "name": "조선롹스타",
    "badges": [],
    "coverImageUrl": "https://static.manhwakyung.com/title/joseonrockstar/thumbnail/joseonrockstar-cover-49474be5.png",
    "type": "FULL_TITLE",
    "notice": "",
    "updated": false,
    "description": "21세기 록 그룹 '열대우림'의 보컬 김유나,\n조선 시대 악공과 만나 밴드를 결성해 조선 최초로\n퓨전국악을 울려 퍼지게 한다!",
    "genres": [
      "드라마",
      "유머",
      "판타지"
    ],
    "likesCount": 0,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/joseonrockstar/thumbnail/joseonrockstar-list-thumbnail-4adf6294.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/joseonrockstar/thumbnail/joseonrockstar-sub-theme-a65f0ef0.jpg",
    "creator": {
      "id": 42,
      "description": "독자님들이 즐거우시다면, 이 한 몸 불살라 즐거운 만화를 만들 준비가 되어 있는 전분입니다!",
      "profileImageUrl": "https://static.manhwakyung.com/creator/42/profile-7fd4f28d.jpg",
      "name": "전분"
    },
    "id": 35
  }
  ,
  "36":
  {
    "id": 36,
    "likesCount": 0,
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "creator": {
      "id": 43,
      "description": "신인 작가 원성재입니다. 감정이 전해지는 만화를 목표로 하고 있습니다. 재미있는 체험이 될 수 있게 노력하겠습니다!",
      "name": "원성재",
      "profileImageUrl": "https://static.manhwakyung.com/creator/43/profile-67cfd108.jpg"
    },
    "lastNumberName": "",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "name": "화초 죽이기",
    "description": "'좋아한다' 라는 감정만으로 연애가 지속될 수 있을까? \n시들어가는 감정을 마주하게 된 한 연인의 이야기.",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/killplant/thumbnail/killplant-list-thumbnail-fcb72a61.jpg",
    "introImageUrls": [],
    "shortDescription": "시들어버린 감정을 대하는 연인의 이야기",
    "bgColor": "#9eae50",
    "isbn": "",
    "coverImageUrl": "",
    "updated": false,
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/killplant/thumbnail/killplant-thumbnail-6e5b23f6.jpg",
    "createdAt": "2020-06-03T15:56:41.321+09:00",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/killplant/thumbnail/killplant-sub-theme-ff4af015.jpg",
    "notice": "",
    "nickname": "killplant",
    "firstNumberName": "",
    "type": "SHORT_TITLE",
    "genres": [
      "로맨스",
      "멜로",
      "스토리"
    ],
    "status": "CLOSE"
  }
  ,
  "37":
  {
    "notice": "",
    "firstNumberName": "",
    "shortDescription": "찌질했지만 빛났던 그 시절 우리들의 이야기",
    "nickname": "theseasonwhenweare",
    "type": "SHORT_TITLE",
    "coverImageUrl": "",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/theseasonwhenweare/thumbnail/theseasonwhenweare-thumbnail-c151c316.jpg",
    "bgColor": "#c1cc68",
    "status": "CLOSE",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/44/profile-7c83846a.jpg",
      "id": 44,
      "description": "지친 하루에 휴식 같은 이야기를 들려주고 싶은 작가 정현입니다.",
      "name": "정현"
    },
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/theseasonwhenweare/thumbnail/theseasonwhenweare-sub-theme-adacdefd.jpg",
    "updated": false,
    "isbn": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/theseasonwhenweare/thumbnail/theseasonwhenweare-list-thumbnail-e364585c.jpg",
    "id": 37,
    "genres": [
      "드라마",
      "로맨스",
      "스토리"
    ],
    "createdAt": "2020-06-17T10:19:53.878+09:00",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "lastNumberName": "",
    "likesCount": 0,
    "name": "그때, 우리가 있었던 계절",
    "description": "허세롭지만 마음만은 진짜인 그들의 찌질했던\n사랑 이야기. 그땐 왜 그랬을까 하면서도\n지금의 나는 괜찮은 어른이 되긴 한 걸까?\n의문이 드는 모든 어른들에게.",
    "introImageUrls": [],
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    }
  }
  ,
  "38":
  {
    "name": "꿈의 반려",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "updated": false,
    "genres": [
      "미스터리",
      "스토리",
      "판타지"
    ],
    "notice": "",
    "shortDescription": "꿈속에서 길렀던 반려동물에 대하여",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "creator": {
      "name": "심모람",
      "profileImageUrl": "https://static.manhwakyung.com/creator/45/profile-130b65a7.jpg",
      "description": "안녕하세요. 심모람입니다. <수줍어서 그래>,<멍멍냠냠> 연재, 출간. 심플하고 개성있는 그림체를 좋아합니다. 동물과 사람의 이야기를 그리는 건 언제나 즐거워요.",
      "id": 45
    },
    "description": "'새롬'이 자신의 어린 시절을 회상하며 담담하게 이야기를 들려준다. \n그 무렵 꿈에서 만났던 신비로운 존재에 대하여.",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/dreamfriends/thumbnail/dreamfriends-list-thumbnail-161e5b34.jpg",
    "likesCount": 0,
    "type": "SHORT_TITLE",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/dreamfriends/thumbnail/dreamfriends-grid-thumbnail-96ab5037.jpg",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/dreamfriends/thumbnail/dreamfriends-thumbnail-0a9f629d.jpg",
    "introImageUrls": [],
    "isbn": "",
    "firstNumberName": "",
    "coverImageUrl": "",
    "bgColor": "#84cbed",
    "nickname": "dreamfriends",
    "id": 38,
    "lastNumberName": "",
    "status": "CLOSE",
    "createdAt": "2020-06-23T17:13:07.713+09:00"
  }
  ,
  "39":
  {
    "nickname": "eugene-vol1",
    "genres": [
      "에피소드",
      "옴니버스",
      "판타지"
    ],
    "lastNumberName": "",
    "bgColor": "#d15e7b",
    "notice": "",
    "updated": false,
    "firstNumberName": "",
    "name": "유진의 환상특급열차 vol.1",
    "isbn": "",
    "likesCount": 0,
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/eugene-vol1/thumbnail/eugene-vol1-thumbnail-906d09de.jpg",
    "type": "SHORT_TITLE",
    "ageRating": {
      "label": "15세 이용가",
      "type": "AGE_15"
    },
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/eugene-vol1/thumbnail/eugene-vol1-grid-thumbnail-3b29a41c.jpg",
    "introImageUrls": [],
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/47/profile-13f1c5d2.jpg",
      "description": "웹툰과 동화를 그리는 사람입니다. 아내 말 잘 듣는 현부양부가 되겠다는 청운의 꿈을 가지고 살아가고 있습니다. 피너툰에서 웹툰 '좀비 플래너'를 연재했으며, 그린 책으로는 '해드리의 인간 마을 탐방기'와 '좀비를 만난다면'이 있습니다. ​​",
      "name": "조녘",
      "id": 47
    },
    "coverImageUrl": "",
    "id": 39,
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "status": "CLOSE",
    "description": "또 다른 평행 우주 속 당신을 만나본 적 있나요?\n유진이, 유진을 보면서, 유진에 대해 생각하는, \n유진들이 살아가는 세상의 이야기가 여기 있습니다.",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/eugene-vol1/thumbnail/eugene-vol1-list-thumbnail-5f77f147.jpg",
    "shortDescription": "유진이 보여주는 유진들이 사는 세상",
    "createdAt": "2020-07-09T10:52:27.104+09:00"
  }
  ,
  "40":
  {
    "introImageUrls": [],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/different/thumbnail/different-thumbnail-71d8ed5e.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/different/thumbnail/different-grid-thumbnail-d9174ca8.jpg",
    "shortDescription": "다르지만 다르지 않은, 우리 두 사람",
    "id": 40,
    "genres": [
      "로맨스",
      "멜로",
      "옴니버스"
    ],
    "updated": false,
    "firstNumberName": "",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/different/thumbnail/different-list-thumbnail-8b41489c.jpg",
    "name": "다름이 아니라",
    "createdAt": "2020-07-15T16:36:27.18+09:00",
    "likesCount": 0,
    "bgColor": "#d2ee6c",
    "type": "SHORT_TITLE",
    "nickname": "different",
    "status": "CLOSE",
    "lastNumberName": "",
    "notice": "",
    "creator": {
      "description": "미스터블루에서 '고백을 못하고', 다음웹툰에서 '너도나랑'을 연재한 웹툰작가 석영입니다.",
      "name": "석영",
      "profileImageUrl": "https://static.manhwakyung.com/creator/48/profile-d9ad2b25.jpg",
      "id": 48
    },
    "isbn": "",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "description": "다르지만 다르지 않은,\n결국은 같은 마음인 두 사람의 두 가지 이야기.",
    "coverImageUrl": ""
  }
  ,
  "41":
  {
    "shortDescription": "잊고 있었던 누군가의 안녕을 바라는 그런 어느 날",
    "updated": false,
    "introImageUrls": [],
    "nickname": "oneday",
    "type": "SHORT_TITLE",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/oneday/thumbnail/oneday-thumbnail-951b4aef.jpg",
    "createdAt": "2020-07-23T14:23:30.363+09:00",
    "id": 41,
    "status": "CLOSE",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/oneday/thumbnail/oneday-grid-thumbnail-96e9cf7e.jpg",
    "description": "사라지고 변하는 것들에 대한 \n막연한 그리움이 밀려오는 어느 날 문득\n내내 잊고 있었던 그 사람의 안녕을 바라며",
    "coverImageUrl": "",
    "likesCount": 0,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/oneday/thumbnail/oneday-list-thumbnail-9d267fcb.jpg",
    "firstNumberName": "",
    "lastNumberName": "",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "bgColor": "#4e4141",
    "notice": "",
    "name": "어느 날, 문득",
    "isbn": "",
    "genres": [
      "드라마"
    ],
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/49/profile-44e8fc50.jpg",
      "id": 49,
      "name": "류가명",
      "description": "만화경에서 좋은 기회로 짧은 단편을 공개하게 되어 기쁩니다. 좋은 하루 되세요."
    }
  }
  ,
  "42":
  {
    "shortDescription": "만화가 달나무와 그의 뮤즈인 고양이 이바의 이별 이야기",
    "lastNumberName": "",
    "type": "SHORT_TITLE",
    "bgColor": "#0072bb",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "genres": [
      "드라마",
      "유머",
      "일상"
    ],
    "firstNumberName": "",
    "status": "CLOSE",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/goodbyeeva/thumbnail/goodbyeeva-thumbnail-351c85eb.jpg",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/50/profile-3b642583.jpg",
      "description": "안녕하세요. 달나무입니다. 주로 고양이를 주제로 작품을 하는 개그 만화가. 2000년대 초반 <달나무의 고양이방>이라는 카툰 에세이로 데뷔했어요. <냐옹이를 부탁해> <고양이의 숲> <고양이 이바가 왔다옹> 등의 저서가 있어요. 현재 춘봉이와 츄츄 두 고양이의 집사랍니다.",
      "name": "달나무",
      "id": 50
    },
    "isbn": "",
    "coverImageUrl": "",
    "name": "안녕 이바, 안녕 나의 고양이",
    "id": 42,
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "updated": false,
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/goodbyeeva/thumbnail/goodbyeeva-grid-thumbnail-ff6e69da.jpg",
    "notice": "",
    "introImageUrls": [],
    "nickname": "goodbyeeva",
    "likesCount": 0,
    "createdAt": "2020-07-27T14:05:38.62+09:00",
    "description": "만화가 달나무의 애묘이자 뮤즈인 고양이 이바는 10살이 되던 해에 신부전 말기 판정을 받게 된다. 남은 시간은 고작 3개월. 달나무와 이바는 따뜻하고 슬프지 않은 이별을 준비한다.",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/goodbyeeva/thumbnail/goodbyeeva-list-thumbnail-58b914fb.jpg"
  }
  ,
  "43":
  {
    "coverImageUrl": "https://static.manhwakyung.com/title/imseulgi/thumbnail/imseulgi-cover-87de3531.png",
    "id": 43,
    "nickname": "imseulgi",
    "firstNumberName": "",
    "shortDescription": "평범한 슬기에게 찾아온 뜻밖의 초능력!",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/imseulgi/thumbnail/imseulgi-thumbnail-ad1d70f6.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/imseulgi/thumbnail/imseulgi-grid-thumbnail-09bd327d.jpg",
    "likesCount": 0,
    "createdAt": "2020-07-30T17:30:35.633+09:00",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "updated": false,
    "lastNumberName": "",
    "creator": {
      "id": 23,
      "profileImageUrl": "https://static.manhwakyung.com/creator/23/profile-1df19c8d-ac57-4c51-aa08-e37964ef6455.jpg",
      "description": "안녕하세요. 만화경에서 단편만화 <논스톱 서브웨이>를 그렸던 모 입니다:)",
      "name": "모"
    },
    "description": "은행 로비 매니저 슬기, 그에게 찾아온 뜻밖의 초능력! \n하지만 딱히 그의 삶에 도움이 되는 것 같지 않다..?",
    "genres": [
      "드라마",
      "일상",
      "판타지"
    ],
    "name": "나는 슬기",
    "badges": [],
    "notice": "",
    "bgColor": "#78a2fa",
    "type": "FULL_TITLE",
    "isbn": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/imseulgi/thumbnail/imseulgi-list-thumbnail-63f5780c.jpg",
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/2/d-2.jpg",
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "text": "다음 화 업데이트일"
    },
    "status": "WORKING",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/imseulgi/thumbnail/imseulgi-intro-a6491eb0.jpg"
    ]
  }
  ,
  "44":
  {
    "type": "FULL_TITLE",
    "shortDescription": "사라진 집을 찾으려는 남매와 친구들의 기묘한  모험",
    "status": "WORKING",
    "name": "홈리스 탐정",
    "notice": "",
    "description": "초자연 현상 전문 탐정 사무소를 운영하는 주인공 정화진, \n정화인은 사라져버린 추억이 담긴 집을 되찾기 위해, \n미스테리한 사건들을 해결해나간다.",
    "genres": [
      "미스터리",
      "판타지"
    ],
    "nickname": "homelessdetective",
    "coverImageUrl": "https://static.manhwakyung.com/title/homelessdetective/thumbnail/homelessdetective-cover-f097bf39.png",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/homelessdetective/thumbnail/homelessdetective-thumbnail-94f2d783.jpg",
    "badges": [],
    "firstNumberName": "",
    "isbn": "",
    "likesCount": 0,
    "createdAt": "2020-07-31T14:43:33.182+09:00",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/homelessdetective/thumbnail/homelessdetective-grid-thumbnail-c63f0169.jpg",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/homelessdetective/thumbnail/homelessdetective-intro-20f5aadf.jpg"
    ],
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-2.jpg",
      "text": "다음 화 업데이트일",
      "reservedAt": "2020-09-02T11:55:00.548+09:00"
    },
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/homelessdetective/thumbnail/homelessdetective-list-thumbnail-d7888bc0.jpg",
    "lastNumberName": "",
    "id": 44,
    "creator": {
      "name": "가원",
      "profileImageUrl": "https://static.manhwakyung.com/creator/26/profile-b76a7901.jpg",
      "id": 26,
      "description": "평범한 순간들 속에 존재하는 특별한 빛을 찾고 있습니다."
    },
    "bgColor": "#bea1ff",
    "updated": false,
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    }
  }
  ,
  "45":
  {
    "creator": {
      "name": "정현",
      "profileImageUrl": "https://static.manhwakyung.com/creator/44/profile-7c83846a.jpg",
      "description": "지친 하루에 휴식 같은 이야기를 들려주고 싶은 작가 정현입니다.",
      "id": 44
    },
    "updated": false,
    "genres": [
      "드라마",
      "로맨스"
    ],
    "firstNumberName": "",
    "coverImageUrl": "https://static.manhwakyung.com/title/beside/thumbnail/beside-cover-92c38716.png",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/beside/thumbnail/beside-list-thumbnail-3a886e57.jpg",
    "status": "WORKING",
    "shortDescription": "반려견 덕배와 살아가는 형배의 이야기.",
    "nextEpisode": {
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/1/d-2.jpg",
      "text": "다음 화 업데이트일"
    },
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "likesCount": 0,
    "badges": [],
    "id": 45,
    "nickname": "beside",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/beside/thumbnail/beside-thumbnail-b896b522.jpg",
    "name": "곁에",
    "lastNumberName": "",
    "type": "FULL_TITLE",
    "bgColor": "#bdcb82",
    "createdAt": "2020-07-31T14:47:51.437+09:00",
    "description": "반려견 덕배와 지내면서 새로운 가족의 의미를 찾아가는 \n주인공 형배의 가슴 따뜻한 일상 멜로 드라마.",
    "notice": "",
    "isbn": "",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/beside/thumbnail/beside-intro-92361f73.jpg"
    ],
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/beside/thumbnail/beside-grid-thumbnail-b3400e05.jpg"
  }
  ,
  "46":
  {
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/monstermeal/thumbnail/monstermeal-grid-thumbnail-18c5e90b.jpg",
    "coverImageUrl": "https://static.manhwakyung.com/title/monstermeal/thumbnail/monstermeal-cover-56edec46.png",
    "bgColor": "#87888b",
    "notice": "",
    "createdAt": "2020-07-31T14:50:17.531+09:00",
    "nickname": "monstermeal",
    "updated": false,
    "genres": [
      "유머",
      "일상",
      "판타지"
    ],
    "likesCount": 0,
    "introImageUrls": [
      "https://static.manhwakyung.com/title/monstermeal/thumbnail/monstermeal-intro-93d8e97b.jpg"
    ],
    "description": "어디선가 누군가에 무슨 일이 생기면 어김없이 나타나 \n요괴 하나 뚝딱 잡고 밥 한끼 뚝딱 먹는 퇴마직장인들. \n그들에게도 가장 소중한 건 하루를 열심히 보내고 먹는 \n맛있는 한끼!",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/monstermeal/thumbnail/monstermeal-list-thumbnail-2b33871f.jpg",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "id": 46,
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/monstermeal/thumbnail/monstermeal-thumbnail-d15e49c8.jpg",
    "lastNumberName": "",
    "status": "WORKING",
    "isbn": "",
    "nextEpisode": {
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/2/d-2.jpg"
    },
    "name": "요괴 뚝딱 한끼 뚝딱",
    "creator": {
      "id": 51,
      "name": "김양수",
      "description": "'즐겁게 만화!'를 모토로 삼고 있는 N년차 만화가입니다. 저는 원고할 때가 가장 즐겁습니다. 정말입니다. 정말이라고요.",
      "profileImageUrl": "https://static.manhwakyung.com/creator/51/profile-040dcfbe.jpg"
    },
    "shortDescription": "퇴마 직장인(?)들의 본격 식생활툰",
    "firstNumberName": "",
    "type": "FULL_TITLE",
    "badges": []
  }
  ,
  "47":
  {
    "description": "죽고 싶은 사람과 일을 안 하는 저승사자가 만났다. \n평범한 듯 평범하지 않은 사람 사는 이야기.",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/see/thumbnail/see-list-thumbnail-5afbe606.jpg",
    "lastNumberName": "",
    "nextEpisode": {
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/3/d-2.jpg",
      "text": "다음 화 업데이트일"
    },
    "creator": {
      "name": "픽셀",
      "profileImageUrl": "https://static.manhwakyung.com/creator/52/profile-346f08ee.jpg",
      "description": "안녕하세요 픽셀입니다. 과장 없는 연출과 잔잔한 분위기를 추구해요. 누구나 심심할 때 한 번씩은 들여다볼 만한 만화를 그리고 싶습니다.",
      "id": 52
    },
    "genres": [
      "드라마",
      "일상",
      "판타지"
    ],
    "badges": [],
    "updated": false,
    "bgColor": "#7accfe",
    "id": 47,
    "introImageUrls": [
      "https://static.manhwakyung.com/title/see/thumbnail/see-intro-7cf8d148.jpg"
    ],
    "shortDescription": "죽고 싶은 사람과 일을 안 하는 저승사자가 만났다.",
    "firstNumberName": "",
    "likesCount": 0,
    "isbn": "",
    "status": "WORKING",
    "type": "FULL_TITLE",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "createdAt": "2020-07-31T14:53:00.159+09:00",
    "nickname": "see",
    "coverImageUrl": "https://static.manhwakyung.com/title/see/thumbnail/see-cover-39a8096e.png",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/see/thumbnail/see-thumbnail-0e05f8ce.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/see/thumbnail/see-grid-thumbnail-15a7546c.jpg",
    "name": "보다",
    "notice": ""
  }
  ,
  "48":
  {
    "createdAt": "2020-07-31T14:59:22.466+09:00",
    "id": 48,
    "coverImageUrl": "https://static.manhwakyung.com/title/oversizelove/thumbnail/oversizelove-cover-15717de1.png",
    "description": "나보다 17cm 작은 사람을 짝사랑 중! \n지훈이에게 다가갈 수 있을까?",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/oversizelove/thumbnail/oversizelove-thumbnail-9e174214.jpg",
    "lastNumberName": "",
    "isbn": "",
    "bgColor": "#ffb2b4",
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/2/d-2.jpg",
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "text": "다음 화 업데이트일"
    },
    "status": "WORKING",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/oversizelove/thumbnail/oversizelove-intro-52c08a0e.jpg"
    ],
    "creator": {
      "description": "안녕하세요, 만화로 달콤함을 주고 싶은 밍다입니다. 잘 부탁드려요!",
      "id": 53,
      "name": "밍다",
      "profileImageUrl": "https://static.manhwakyung.com/creator/53/profile-fb4144e6.jpg"
    },
    "nickname": "oversizelove",
    "firstNumberName": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/oversizelove/thumbnail/oversizelove-list-thumbnail-34760940.jpg",
    "genres": [
      "로맨스",
      "학원"
    ],
    "notice": "",
    "type": "FULL_TITLE",
    "shortDescription": "우리의 차이는 17cm",
    "badges": [],
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "updated": false,
    "likesCount": 0,
    "name": "오버사이즈 러브",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/oversizelove/thumbnail/oversizelove-grid-thumbnail-992b476a.jpg"
  }
  ,
  "49":
  {
    "badges": [],
    "status": "WORKING",
    "type": "FULL_TITLE",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/loveyou/thumbnail/loveyou-intro-43238c80.jpg"
    ],
    "updated": false,
    "creator": {
      "description": "인생처럼 성장하는 이야기를 좋아합니다. 선한 봄처럼 마음의 여유가 생기고 처음과 끝이 기분 좋은 작품을 만드는 것이 목표입니다. 이 작가를 떠올리면 봄이 생각났으면 좋겠습니다. 언젠간 웹툰 시장을 뿌숴주마.",
      "profileImageUrl": "https://static.manhwakyung.com/creator/54/profile-39bff377.jpg",
      "name": "이온상",
      "id": 54
    },
    "notice": "",
    "description": "\"죽을 수 없다면 살아갈 이유를 알려줘.\" \n평생 외로울 운명을 타고난 '소원'의 주위는 \n늘 불행의 기운이 맴돈다. \n그런 '소원' 앞에 운명을 바꿔줄 수호령이 찾아오는데...!",
    "likesCount": 0,
    "coverImageUrl": "https://static.manhwakyung.com/title/loveyou/thumbnail/loveyou-cover-4b65bd37.png",
    "createdAt": "2020-08-04T09:51:53.966+09:00",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/loveyou/thumbnail/loveyou-thumbnail-4b36b637.jpg",
    "ageRating": {
      "label": "12세 이용가",
      "type": "AGE_12"
    },
    "bgColor": "#86bfff",
    "name": "사랑을 너에게",
    "shortDescription": "주어진 운명을 바꾸며 성장하는 학원 판타지",
    "nextEpisode": {
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "text": "다음 화 업데이트일",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-2.jpg"
    },
    "nickname": "loveyou",
    "id": 49,
    "genres": [
      "드라마",
      "판타지",
      "학원"
    ],
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/loveyou/thumbnail/loveyou-list-thumbnail-029c6a86.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/loveyou/thumbnail/loveyou-grid-thumbnail-7bf445e4.jpg",
    "firstNumberName": "",
    "isbn": "",
    "lastNumberName": ""
  }
  ,
  "50":
  {
    "id": 50,
    "notice": "",
    "shortDescription": "다시 과거로 돌아간다면,  첫사랑을 이룰 수 있을까요?",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/paper-airplane/thumbnail/paper-airplane-intro-4f67f9f8.jpg"
    ],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/paper-airplane/thumbnail/paper-airplane-thumbnail-ee9ade3e.jpg",
    "coverImageUrl": "https://static.manhwakyung.com/title/paper-airplane/thumbnail/paper-airplane-cover-3b79e358.png",
    "nextEpisode": {
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/0/d-2.jpg",
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "text": "다음 화 업데이트일"
    },
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "status": "WORKING",
    "name": "종이비행기를 날리면",
    "type": "FULL_TITLE",
    "lastNumberName": "",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/paper-airplane/thumbnail/paper-airplane-list-thumbnail-94c48dc6.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/paper-airplane/thumbnail/paper-airplane-grid-thumbnail-19f9ae1f.jpg",
    "likesCount": 0,
    "createdAt": "2020-08-04T09:55:43.475+09:00",
    "nickname": "paper-airplane",
    "bgColor": "#fea297",
    "badges": [],
    "firstNumberName": "",
    "updated": false,
    "description": "소원을 이뤄주는 수호신과 함께 과거로 돌아가다?! \n첫사랑을 이룰 기회를 얻었지만, 생각지도 못한 장애물들이 \n'수연'을 기다리고 있는데...\n'수연'은 첫사랑을 이룰 수 있을까?",
    "genres": [
      "로맨스",
      "판타지",
      "학원"
    ],
    "isbn": "",
    "creator": {
      "description": "모두가 좋아하는 만화를 그리고싶은 하마, 모하입니다.",
      "profileImageUrl": "https://static.manhwakyung.com/creator/55/profile-1c5a8012.jpg",
      "id": 55,
      "name": "모하"
    }
  }
  ,
  "51":
  {
    "type": "FULL_TITLE",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "nickname": "king",
    "firstNumberName": "",
    "coverImageUrl": "https://static.manhwakyung.com/title/king/thumbnail/king-cover-b4b9e0e1.png",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/king/thumbnail/king-thumbnail-ed211617.jpg",
    "badges": [],
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/king/thumbnail/king-grid-thumbnail-bc90f440.jpg",
    "likesCount": 0,
    "id": 51,
    "status": "WORKING",
    "bgColor": "#636363",
    "updated": false,
    "notice": "",
    "shortDescription": "현실마저 벅차던 그때, 오목왕을 꿈꾸는 선생님을 만나다",
    "name": "오목왕",
    "lastNumberName": "",
    "createdAt": "2020-08-04T09:58:07.965+09:00",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/king/thumbnail/king-intro-f96c85c1.jpg"
    ],
    "isbn": "",
    "description": "바둑영재 타이틀을 뒤로하고 공무원을 준비하는 '강구'.\n그런 강구 앞에 괴짜 선생 '봉락'이 다가온다.\n\"너, 오목부 안 할래?\" \n'강구'와 '봉락'의 인생에 대한 메시지.",
    "nextEpisode": {
      "text": "다음 화 업데이트일",
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/3/d-2.jpg"
    },
    "genres": [
      "드라마",
      "학원"
    ],
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/king/thumbnail/king-list-thumbnail-121e0a81.jpg",
    "creator": {
      "profileImageUrl": "https://static.manhwakyung.com/creator/56/profile-e29e0908.jpg",
      "id": 56,
      "name": "김경언",
      "description": "부산에 살고있는 28살 오목왕 작가 김경언입니다. 잘 부탁드립니다."
    }
  }
  ,
  "52":
  {
    "bgColor": "#ffd74b",
    "likesCount": 0,
    "isbn": "",
    "description": "어느덧 13년 차 만화가, 꿈을 이루면 끝인 걸까?\n만화가로 데뷔하기까지의 날들과 꿈이 이루어진\n그 후의 삶에 대한 솔직한 이야기",
    "updated": false,
    "status": "WORKING",
    "firstNumberName": "",
    "notice": "",
    "genres": [
      "드라마",
      "일상"
    ],
    "nextEpisode": {
      "text": "다음 화 업데이트일",
      "reservedAt": "2020-09-02T11:55:00.548+09:00",
      "thumbnailImageUrl": "https://static.manhwakyung.com/episode-next/2/d-2.jpg"
    },
    "badges": [],
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/one-step/thumbnail/one-step-thumbnail-46e8a7ac.jpg",
    "coverImageUrl": "https://static.manhwakyung.com/title/one-step/thumbnail/one-step-cover-272696c2.png",
    "id": 52,
    "name": "매일 한 칸씩",
    "shortDescription": "주사위를 굴리고 인생게임을 시작하세요",
    "createdAt": "2020-08-04T10:05:00.048+09:00",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/one-step/thumbnail/one-step-intro-e7cd05e7.jpg"
    ],
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/one-step/thumbnail/one-step-list-thumbnail-936f31b7.jpg",
    "ageRating": {
      "type": "AGE_ALL",
      "label": "전체 연령가"
    },
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/one-step/thumbnail/one-step-grid-thumbnail-50050764.jpg",
    "lastNumberName": "",
    "creator": {
      "description": "빠르진 않지만 제 속도로 꾸준하게 걷고 있는 만화가 예묘예요. 앞으로도 하고 싶은 이야기가 아주 많아요.",
      "id": 57,
      "name": "예묘",
      "profileImageUrl": "https://static.manhwakyung.com/creator/57/profile-7162d673.jpg"
    },
    "nickname": "one-step",
    "type": "FULL_TITLE"
  }
  ,
  "53":
  {
    "description": "이 세상 모든 과자가 있는 마법제과점!\n모든 걸 잊고 싶은 '솔이'는 기억을 지워주는 과자를 구하고\n행복해질 수 있을까요? \n어느 여름날 마주한 마법 같은 이야기를 만나보세요.",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "shortDescription": "모든 걸 잊고 싶던 소녀가 마주한 기적",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/starday/thumbnail/starday-thumbnail-e663a168.jpg",
    "status": "CLOSE",
    "creator": {
      "name": "하엔",
      "profileImageUrl": "https://static.manhwakyung.com/creator/58/profile-f634e127.jpg",
      "id": 58,
      "description": "안녕하세요, 하엔입니다. 제 이야기를 감상해주신 모든 분들께 행복이 가득했으면 좋겠습니다. 감사합니다."
    },
    "createdAt": "2020-08-06T10:16:52.052+09:00",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/starday/thumbnail/starday-grid-thumbnail-a32a192a.jpg",
    "introImageUrls": [
      "https://static.manhwakyung.com/title/starday/thumbnail/starday-intro-995272dd.jpg"
    ],
    "firstNumberName": "",
    "id": 53,
    "lastNumberName": "",
    "bgColor": "#d03f18",
    "isbn": "",
    "notice": "",
    "coverImageUrl": "https://static.manhwakyung.com/title/starday/thumbnail/starday-cover-9af85f8d.png",
    "type": "SHORT_TITLE",
    "likesCount": 0,
    "genres": [
      "스토리",
      "판타지"
    ],
    "nickname": "starday",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    },
    "name": "별이 내린 여름날",
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/starday/thumbnail/starday-list-thumbnail-2cd0d471.jpg",
    "updated": false
  }
  ,
  "54":
  {
    "isbn": "",
    "coverImageUrl": "https://static.manhwakyung.com/title/gonyangdiary/thumbnail/gonyangdiary-cover-b55a7e86.png",
    "notice": "",
    "description": "고냥이의 사소한 나날들을 그린 그냥 일기 만화입니다.\n어딘가 찌질하고 짠한 모습이 내 모습과 닮은 것 같기도 해요.",
    "badges": [
      {
        "type": "TITLE_CLOSE"
      }
    ],
    "introImageUrls": [
      "https://static.manhwakyung.com/title/gonyangdiary/thumbnail/gonyangdiary-intro-a35a8e89.jpg"
    ],
    "nickname": "gonyangdiary",
    "likesCount": 0,
    "bgColor": "#ffda3e",
    "firstNumberName": "",
    "name": "고냥 일기",
    "thumbnailImageUrl": "https://static.manhwakyung.com/title/gonyangdiary/thumbnail/gonyangdiary-thumbnail-860399d5.jpg",
    "creator": {
      "name": "임나운",
      "profileImageUrl": "https://static.manhwakyung.com/creator/59/profile-9e87244c.jpg",
      "id": 59,
      "description": "그림으로 기억을 기록합니다."
    },
    "shortDescription": "고냥이의 사소한 나날들을 그린 그냥 일기 만화",
    "type": "SHORT_TITLE",
    "updated": false,
    "listThumbnailImageUrl": "https://static.manhwakyung.com/title/gonyangdiary/thumbnail/gonyangdiary-list-thumbnail-51486943.jpg",
    "gridThumbnailImageUrl": "https://static.manhwakyung.com/title/gonyangdiary/thumbnail/gonyangdiary-grid-thumbnail-794b2094.jpg",
    "createdAt": "2020-08-11T09:51:30.346+09:00",
    "id": 54,
    "lastNumberName": "",
    "genres": [
      "에피소드",
      "유머",
      "일상"
    ],
    "status": "CLOSE",
    "ageRating": {
      "label": "전체 연령가",
      "type": "AGE_ALL"
    }
  }
}

const titles = Object.values(titlesMappedById)
