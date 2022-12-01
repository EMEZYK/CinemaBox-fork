const ResponseDictionary = {
  // main
  internalServerError: 'Wystąpił błąd serwera. Spróbuj ponownie później',
  // users
  usersError: 'Nie udało się pobrać danych użytkowników',
  userNotFound: 'Nie znaleziono użytkownika o podanym id',
  userCreated: 'Użytkownik został pomyślnie dodany',
  userNotCreated: 'Wystąpił błąd podczas dodawania użytkownika',
  userUpdated: 'Użytkownik został pomyślnie zaktualizowany',
  userNotUpdated: 'Wystąpił błąd podczas aktualizacji użytkownika',
  userDeleted: 'Użytkownik został pomyślnie usunięty',
  userNotDeleted: 'Wystąpił błąd podczas usuwania użytkownika',
  // movies
  moviesError: 'Nie udało się pobrać listy filmów',
  movieNotFound: 'Nie znaleziono filmu o podanym id',
  movieCreated: 'Film został pomyślnie dodany',
  movieNotCreated: 'Wystąpił błąd podczas dodawania filmu',
  movieUpdated: 'Film został pomyślnie zaktualizowany',
  movieNotUpdated: 'Wystąpił błąd podczas aktualizacji filmu',
  movieDeleted: 'Film został pomyślnie usunięty',
  movieNotDeleted: 'Wystąpił błąd podczas usuwania filmu',
} as const

export default ResponseDictionary
