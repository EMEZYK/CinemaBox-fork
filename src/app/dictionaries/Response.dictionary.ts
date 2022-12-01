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
} as const

export default ResponseDictionary
