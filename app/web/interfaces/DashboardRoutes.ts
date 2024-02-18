export interface DashboardRoutes {
  [key: string]: string;
}
export interface GroupRoutes {
  home: string;
  form: string;
  search: string;
  dashboards?: DashboardRoutes;
}
