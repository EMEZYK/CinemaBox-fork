import { HttpException } from "@nestjs/common";
import * as dayjs from "dayjs";

import AllowedShowingFilters from "../constants/AllowedShowingFilters";

class ShowingValidator {
  static date(date?: string) {
    if (!date) {
      throw new HttpException('Data jest wymagana', 400)
    }

    if (!dayjs(date).isValid()) {
      throw new HttpException('Data jest niepoprawna', 400)
    }

    return date
  }

  static filters(filters?: string[], hallId?: number) {
    if (!filters) {
      throw new HttpException('Filtry są wymagane', 400)
    }

    let parsedFitlers
    try {
      parsedFitlers = JSON.parse(`${filters}`)
    } catch (err) {
      throw new HttpException('Filtry są niepoprawne. Przykład: ["week"]', 400)
    }

    if (!Array.isArray(parsedFitlers)) {
      throw new HttpException('Filtry są niepoprawne. Przykład: ["week"]', 400)
    }

    if (!parsedFitlers.length) {
      throw new HttpException('Filtry są wymagane', 400)
    }

    parsedFitlers.forEach((filter) => {
      if (!AllowedShowingFilters.includes(filter)) {
        throw new HttpException({
          message: `${filter.toUpperCase()} nie jest dozwolonym filtrem`,
          allowedFilters: AllowedShowingFilters,
        }, 400)
      }

      if (parsedFitlers.includes('hall') && !hallId) {
        throw new HttpException('Id sali jest wymagane', 400)
      }
    })

    return parsedFitlers
  }

  static hallId(hallId?: number) {
    if (!hallId) {
      throw new HttpException('Id sali jest wymagane', 400)
    }

    const parsedHallId = parseInt(`${hallId}`)
    if (!parsedHallId || parsedHallId < 0) {
      throw new HttpException('Id sali jest niepoprawne', 400)
    }

    return parsedHallId
  }
}

export default ShowingValidator
