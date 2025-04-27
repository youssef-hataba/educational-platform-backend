import { CourseCategory, Level, CourseLanguage } from "../types/course";

export const applyFilters = (query: any, filters: any) => {
  const { search, category, rating, duration, level, language, priceType } = filters;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  if (category && Object.values(CourseCategory).includes(category as CourseCategory)) {
    query.category = category;
  }

  if (language) {
    const languagesArray = Array.isArray(language) ? language : [language];

    const validLanguages = languagesArray.filter(lang =>
      Object.values(CourseLanguage).includes(lang as CourseLanguage)
    );

    if (validLanguages.length) {
      query.language = { $in: validLanguages };
    }
  }

  if (level && Object.values(Level).includes(level as Level)) {
    query.level = level;
  }

  if (rating) {
    query.averageRating = { $gte: Number(rating) };
  }

  if (duration) {
    const durationRanges: Record<string, any> = {
      "0-1": { $gte: 0, $lte: 1 },
      "1-3": { $gt: 1, $lte: 3 },
      "3-6": { $gt: 3, $lte: 6 },
      "6-17": { $gt: 6, $lte: 17 },
      "17+": { $gt: 17 },
    };
    if (durationRanges[duration]) {
      query.duration = durationRanges[duration];
    }
  }

  if (priceType === "free") {
    query.price = 0;
  } else if (priceType === "paid") {
    query.price = { $gt: 0 };
  }

  return query;
}