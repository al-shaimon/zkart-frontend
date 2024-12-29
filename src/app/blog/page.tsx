'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogs } from './data';

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and insights about our products and industry.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogs.map((blog) => (
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
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog.readTime}
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <div className="flex items-center text-primary font-medium">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
