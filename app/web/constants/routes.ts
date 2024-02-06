export const UserGroupRoutes = {
  medical: {
    home: "/medical/home",
    form: "/medical/form",
    search: "/medical/search",
  },
  sanctuary: {
    home: "/sanctuary/home",
    form: "/sanctuary/form",
    search: "/sanctuary/search",
  },
};

export type UserGroupKey = keyof typeof UserGroupRoutes;
