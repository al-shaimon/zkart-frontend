import { blogs } from "@/app/blog/data";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogSection() {
  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Latest from Blog</h2>
        <Link href="/blog" className="text-primary hover:text-primary/80">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.slice(0, 3).map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                {blog.category}
              </span>
              <h3 className="text-lg font-semibold mt-2 group-hover:text-primary transition-colors line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm line-clamp-2">{blog.excerpt}</p>
              <div className="flex items-center text-primary text-sm font-medium mt-4">
                Read More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
