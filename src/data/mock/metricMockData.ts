export interface MetricMockItem {
  metricId: string;
  metricLabel: string;
  metricValue: string;
  metricChange: string;
}

export const metricMockData: MetricMockItem[] = [
  {
    metricId: "metric-users",
    metricLabel: "注册用户",
    metricValue: "128,430",
    metricChange: "+12.8%",
  },
  {
    metricId: "metric-creators",
    metricLabel: "认证创作者",
    metricValue: "1,284",
    metricChange: "+6.2%",
  },
  {
    metricId: "metric-posts",
    metricLabel: "本周 Post",
    metricValue: "8,912",
    metricChange: "+18.4%",
  },
  {
    metricId: "metric-reports",
    metricLabel: "待审核举报",
    metricValue: "37",
    metricChange: "-9.1%",
  },
];
