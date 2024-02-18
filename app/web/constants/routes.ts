import { GroupRoutes } from "../interfaces/DashboardRoutes";

export const UserGroupRoutes: Record<UserGroupKey, GroupRoutes> = {
  medical: {
    home: "/medical/home",
    form: "/medical/form",
    search: "/medical/search",
    dashboards: {
      postEventSummary: "/medical/dashboards/postevent-summary",
    },
  },
  sanctuary: {
    home: "/sanctuary/home",
    form: "/sanctuary/form",
    search: "/sanctuary/search",
  },
};

export type UserGroupKey = "medical" | "sanctuary";
