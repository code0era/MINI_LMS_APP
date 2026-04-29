// src/types/course.d.ts
// Raw shapes from api.freeapi.app — confirmed from live API
export interface RawInstructor {
  id: number;
  gender: string;
  name: { title: string; first: string; last: string };
  email: string;
  login: { uuid: string; username: string };
  dob: { date: string; age: number };
  picture: { large: string; medium: string; thumbnail: string };
  nat: string;
}

export interface RawProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// Merged domain type used throughout the app
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  price: number;
  rating: number;
  category: string;
  brand: string;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    country: string;
  };
}
