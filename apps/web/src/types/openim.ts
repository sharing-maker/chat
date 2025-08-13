// OpenIM Message Interface based on official documentation
export interface MessageInfo {
  clientMsgID: string
  serverMsgID: string
  createTime: number
  sendTime: number
  sessionType: number
  sendID: string
  recvID: string
  msgFrom: number
  contentType: number
  platformID: number
  senderNickname: string
  senderFaceUrl: string
  groupID: string
  content: string
  seq: number
  isRead: boolean
  status: number
  attachedInfo: string
  ex: string
  hasReadTime: number
  isReact: boolean
  isExternalExtensions: boolean

  // Message elements based on contentType
  textElem?: TextElem
  pictureElem?: PictureElem
  soundElem?: SoundElem
  videoElem?: VideoElem
  fileElem?: FileElem
  locationElem?: LocationElem
  customElem?: CustomElem
  quoteElem?: QuoteElem
  cardElem?: CardElem
  faceElem?: FaceElem
  atElem?: AtElem
  notificationElem?: NotificationElem
}

export interface TextElem {
  content: string
}

export interface PictureElem {
  sourcePath: string
  sourcePicture: PictureInfo
  bigPicture: PictureInfo
  snapshotPicture: PictureInfo
}

export interface PictureInfo {
  uuid: string
  type: string
  size: number
  width: number
  height: number
  url: string
}

export interface SoundElem {
  uuid: string
  soundPath: string
  sourceUrl: string
  dataSize: number
  duration: number
}

export interface VideoElem {
  videoPath: string
  videoUUID: string
  videoUrl: string
  videoType: string
  videoSize: number
  duration: number
  snapshotPath: string
  snapshotUUID: string
  snapshotSize: number
  snapshotUrl: string
  snapshotWidth: number
  snapshotHeight: number
}

export interface FileElem {
  filePath: string
  uuid: string
  sourceUrl: string
  fileName: string
  fileSize: number
}

export interface LocationElem {
  description: string
  longitude: number
  latitude: number
}

export interface CustomElem {
  data: string
  description: string
  extension: string
}

export interface QuoteElem {
  text: string
  quoteMessage: MessageInfo
}

export interface CardElem {
  userID: string
  nickname: string
  faceURL: string
  ex: string
}

export interface FaceElem {
  index: number
  data: string
}

export interface AtElem {
  text: string
  atUserList: string[]
  atUsersInfo: AtUserInfo[]
  quoteMessage: MessageInfo
  isAtSelf: boolean
}

export interface AtUserInfo {
  atUserID: string
  groupNickname: string
}

export interface NotificationElem {
  detail: string
  defaultTips: string
}

// Message Content Types
export enum MessageContentType {
  Text = 101,
  Picture = 102,
  Sound = 103,
  Video = 104,
  File = 105,
  AtText = 106,
  Merge = 107,
  Card = 108,
  Location = 109,
  Custom = 110,
  Quote = 111,
  Face = 112,
  AdvancedText = 114,
}

// Message Status
export enum MessageStatus {
  Sending = 1,
  SendSuccess = 2,
  SendFailure = 3,
}

// Session Types
export enum SessionType {
  Single = 1,
  Group = 2,
  SuperGroup = 3,
}
