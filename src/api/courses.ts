// src/api/courses.ts
import { api } from "./client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type { RawInstructor, RawProduct, Course } from "../types/course";
import { retry } from "../utils/retry";

export async function getInstructors(page = 1): Promise<RawInstructor[]> {
  const { data } = await retry(() =>
    api.get<ApiResponse<PaginatedResponse<RawInstructor>>>(
      `/api/v1/public/randomusers?page=${page}&limit=10`
    )
  );
  return data.data.data;
}

export async function getProducts(page = 1): Promise<RawProduct[]> {
  const { data } = await retry(() =>
    api.get<ApiResponse<PaginatedResponse<RawProduct>>>(
      `/api/v1/public/randomproducts?page=${page}&limit=10`
    )
  );
  return data.data.data;
}

export function mergeCourses(
  products: RawProduct[],
  instructors: RawInstructor[]
): Course[] {
  return products.map((product, index) => {
    const instructor = instructors[index % instructors.length]!;
    // Remap random categories to our app's domain for consistent UI rendering
    const category = index % 2 === 0 ? "Photography" : "Videography";
    
    return {
      id: String(product.id),
      title: product.title,
      description: product.description,
      thumbnail: product.thumbnail,
      images: product.images,
      price: product.price,
      rating: product.rating,
      category: category,
      brand: product.brand,
      instructor: {
        id: String(instructor.id),
        name: `${instructor.name.first} ${instructor.name.last}`,
        avatar: instructor.picture.medium,
        country: instructor.nat,
      },
    };
  });
}

export async function fetchCourses(page = 1): Promise<Course[]> {
  const [instructors, products] = await Promise.all([
    getInstructors(page),
    getProducts(page),
  ]);
  return mergeCourses(products, instructors);
}

// Documentation: Merges data from randomproducts and randomusers to create a cohesive Course domain model.
