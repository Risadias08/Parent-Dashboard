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

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {course.subject}
        </span>
        <span className="rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
          ★ {course.rating}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">{course.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{course.description}</p>

      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Grade</span>
          <span className="font-medium text-slate-800">{course.grade}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Teacher</span>
          <span className="font-medium text-slate-800">{course.teacher}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Duration</span>
          <span className="font-medium text-slate-800">{course.duration}</span>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <span className="text-xs text-slate-500">Course fee</span>
        <p className="text-xl font-bold text-slate-900">
          ₹{course.price.toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
}
