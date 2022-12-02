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
  // showings
  showingsError: 'Nie udało się pobrać listy seansów',
  showingNotFound: 'Nie znaleziono seansu o podanym id',
  showingCreated: 'Seans został pomyślnie dodany',
  showingNotCreated: 'Wystąpił błąd podczas dodawania seansu',
  showingUpdated: 'Seans został pomyślnie zaktualizowany',
  showingNotUpdated: 'Wystąpił błąd podczas aktualizacji seansu',
  showingDeleted: 'Seans został pomyślnie usunięty',
  showingNotDeleted: 'Wystąpił błąd',
  // halls
  hallsError: 'Nie udało się pobrać listy sal',
  hallNotFound: 'Nie znaleziono sali o podanym id',
  hallCreated: 'Sala została pomyślnie dodana',
  hallNotCreated: 'Wystąpił błąd podczas dodawania sali',
  hallUpdated: 'Sala została pomyślnie zaktualizowana',
  hallNotUpdated: 'Wystąpił błąd podczas aktualizacji sali',
  hallDeleted: 'Sala została pomyślnie usunięta',
  hallNotDeleted: 'Wystąpił błąd podczas usuwania sali',
} as const

export default ResponseDictionary
