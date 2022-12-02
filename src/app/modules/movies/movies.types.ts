type MoviePostData = {
  title: string
  description: string
  isPremiere: boolean
  duration: string
  genre: string[]
  age: string
  img: string
  price: number
  rating: number
}

type MovieUpdateData = {
  title?: string
  description?: string
  genre?: string[]
  age?: string
}

export {
  MoviePostData,
  MovieUpdateData,
}
