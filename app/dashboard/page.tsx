"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import CourseCard from "@/components/courseCard";

type Course = {
  id: number;
  name: string;
  subject: string;
  grade: string;
  teacher: string;
  rating: number;
  price: number;
  duration: string;
  description: string;
};

type User = {
  name: string;
  email: string;
};

const COURSES_PER_PAGE = 8;

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");
        const userResponse = await fetch("/api/auth/me");

        if (userResponse.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!userResponse.ok) throw new Error("Unable to load your account.");

        const userData = await userResponse.json();
        setUser(userData.user);

        const coursesResponse = await fetch("/api/courses");
        if (!coursesResponse.ok) throw new Error("Unable to load courses.");

        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
      } catch {
        setError("We couldn't load the dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  // Apply search and all filters first, then sort the matching courses.
  const sortedCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    const minimumPrice = minPrice === "" ? null : Number(minPrice);
    const maximumPrice = maxPrice === "" ? null : Number(maxPrice);
    const minimumRating = minRating === "" ? null : Number(minRating);

    const filtered = courses.filter((course) => {
      const matchesSearch =
        query === "" ||
        course.name.toLowerCase().includes(query) ||
        course.subject.toLowerCase().includes(query);

      const matchesGrade = grade === "" || course.grade === grade;
      const matchesSubject = subject === "" || course.subject === subject;
      const matchesMinPrice =
        minimumPrice === null || course.price >= minimumPrice;
      const matchesMaxPrice =
        maximumPrice === null || course.price <= maximumPrice;
      const matchesRating =
        minimumRating === null || course.rating >= minimumRating;

      return (
        matchesSearch &&
        matchesGrade &&
        matchesSubject &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRating
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  }, [
    courses,
    search,
    grade,
    subject,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
  ]);

  const totalPages = Math.ceil(sortedCourses.length / COURSES_PER_PAGE);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
    return sortedCourses.slice(startIndex, startIndex + COURSES_PER_PAGE);
  }, [sortedCourses, currentPage]);

  // Keep the current page valid after filters/search reduce the result count.
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(totalPages, 1)));
  }, [totalPages]);

  // Start from page 1 whenever the search/filter/sort criteria change.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, grade, subject, minPrice, maxPrice, minRating, sortBy]);

  const grades = Array.from(
    new Set(courses.map((course) => course.grade))
  ).sort();

  const subjects = Array.from(
    new Set(courses.map((course) => course.subject))
  ).sort();

  function clearFilters() {
    setSearch("");
    setGrade("");
    setSubject("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSortBy("");
    setCurrentPage(1);
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              L
            </div>
            <span className="text-xl font-bold text-slate-900">Learniee</span>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="mt-4 text-sm text-slate-500">Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <h1 className="text-lg font-semibold text-red-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        ) : (
        <>
        <section className="rounded-2xl bg-indigo-600 px-6 py-8 text-white sm:px-10">
          <p className="text-sm font-medium text-indigo-100">Parent Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Welcome back{user ? `, ${user.name}` : ""}! 👋
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
            Discover courses, compare teachers, and find the right learning
            options for your child.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Find a Course</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter, and sort courses to find the right option.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Search
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by course name or subject..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <Filter label="Grade">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All grades</option>
                {grades.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Filter>

            <Filter label="Subject">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All subjects</option>
                {subjects.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Filter>

            <Filter label="Minimum rating">
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Any rating</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
                <option value="4.9">4.9+</option>
              </select>
            </Filter>

            <Filter label="Minimum price">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </Filter>

            <Filter label="Maximum price">
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </Filter>

            <Filter label="Sort by">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Default order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating-high">Rating: High to Low</option>
                <option value="rating-low">Rating: Low to High</option>
              </select>
            </Filter>

            <div className="flex items-end md:col-span-2 lg:col-span-3">
              <button
                onClick={clearFilters}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Courses</h2>
            <span className="text-sm text-slate-500">
              {sortedCourses.length} course
              {sortedCourses.length !== 1 ? "s" : ""}
            </span>
          </div>

          {paginatedCourses.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                        page === currentPage
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No matching courses
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your search, filters, or sorting options.
              </p>
              <button
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
        </>
        )}
      </main>
    </div>
  );
}

function Filter({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
