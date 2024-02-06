/**
 * This file contains the configurations for dashboards
 */

export const MedicalDashboardConfig2023: MedicalDashboardYearConfig = {
  festivalStartDate: "2023-07-20T00:00:00Z",
  festivalEndDate: "2023-07-24T23:59:59Z",
};

export const MedicalDashboardConfigs: MedicalDashboardConfigsType = {
  "2023": MedicalDashboardConfig2023,
};

interface MedicalDashboardYearConfig {
  festivalStartDate: string;
  festivalEndDate: string;
}

interface MedicalDashboardConfigsType {
  [year: string]: MedicalDashboardYearConfig;
}
