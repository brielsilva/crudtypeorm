export interface ApiResponse {
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: Prediction[];
}

export interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
}
