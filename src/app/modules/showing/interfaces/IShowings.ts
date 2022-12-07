interface IShowing {
  showing_id: number
  movie_id: number
  hall_id: number
  start: string
  end: string
  break: number
}

type Showings = {
  showings: IShowings[]
  count: number
}

interface IShowings {
  getShowings: (query: any) => Promise<Showings>
}

export {
  IShowings,
  Showings,
  IShowing
}