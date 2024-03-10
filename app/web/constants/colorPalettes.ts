export const tableColorStylesLight = {
  header: {
    backgroundColor: "#0073e6",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
  },
  subHeader: {
    backgroundColor: "#0066cc",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
  },
  oddRow: {
    backgroundColor: "#eff7fa",
  },
  evenRow: {
    backgroundColor: "#ffffff",
  },
};

export const triageColorStyles = {
  red: {
    backgroundColor: "#800020",
    color: "white",
  },
  yellow: {
    backgroundColor: "#ffbf00",
    color: "black",
  },
  green: {
    backgroundColor: "#008080",
    color: "white",
  },
  white: {
    backgroundColor: "#d3d3d3",
    color: "black",
  },
};

type OffsiteTransportColorStyles = {
  [key: string]: {
    backgroundColor: string;
    color: string;
  };
};

export const offsiteTransportColorStyles: OffsiteTransportColorStyles = {
  ambulance: {
    backgroundColor: "#87ceeb",
    color: "black",
  },
  private: {
    backgroundColor: "#5c5c00",
    color: "white",
  },
  nonEmergency: {
    backgroundColor: "#ff7f50",
    color: "black",
  },
};
