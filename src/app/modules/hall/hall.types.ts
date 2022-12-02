type CreateHallData = {
  rows: number;
  columns: number;
  hall_no: number;
}

type UpdateHallData = {
  rows?: number;
  columns?: number;
}

export {
  CreateHallData,
  UpdateHallData,
}
