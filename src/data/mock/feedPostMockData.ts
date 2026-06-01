export interface FeedPostMockItem {
  postId: string;
  authorName: string;
  handle: string;
  badgeText: string;
  contentText: string;
  handSummary: string;
  statsText: string;
}

export const feedPostMockData: FeedPostMockItem[] = [
  {
    postId: "post-001",
    authorName: "Jamie",
    handle: "jamie_pkr",
    badgeText: "认证",
    contentText: "澳门高额桌第三手，转牌拿到坚果同花听牌，河牌面对 1.4 pot overbet。",
    handSummary: "BTN vs BB · NLH 50/100 · River spot",
    statsText: "128 评论 · 2.4k 浏览 · 36 收藏",
  },
  {
    postId: "post-002",
    authorName: "Nick Wang",
    handle: "river_nick",
    badgeText: "KOL",
    contentText: "这手牌我更关心 turn sizing，下注 33% 和 75% 对对手范围的影响完全不同。",
    handSummary: "CO vs SB · SRP · Turn strategy",
    statsText: "64 评论 · 980 浏览 · 18 收藏",
  },
];
