'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogs } from '../data';

const blogContent = {
  'ultimate-guide-smart-home-2024': `
    <article class="prose prose-slate lg:prose-lg xl:prose-xl mx-auto">
      <p>Smart home technology has evolved significantly, and 2024 brings exciting new possibilities for home automation. This comprehensive guide will help you build a connected home that's both functional and future-proof.</p>

      <h2>Understanding Smart Home Ecosystems</h2>
      <p>Before diving into specific devices, it's crucial to understand the major smart home ecosystems:</p>
      <ul>
        <li>Amazon Alexa</li>
        <li>Google Home</li>
        <li>Apple HomeKit</li>
        <li>Samsung SmartThings</li>
      </ul>
      <p>Each ecosystem has its strengths and limitations. Your choice will affect which devices you can integrate seamlessly into your smart home.</p>

      <h2>Essential Smart Home Categories</h2>
      
      <h3>1. Smart Lighting</h3>
      <p>Smart lighting is often the gateway to home automation. Popular options include:</p>
      <ul>
        <li>Philips Hue: Premium, feature-rich ecosystem</li>
        <li>LIFX: Bright, colorful bulbs with no hub required</li>
        <li>Nanoleaf: Decorative lighting panels</li>
        <li>Smart switches vs. smart bulbs considerations</li>
      </ul>

      <h3>2. Smart Security</h3>
      <p>Protect your home with these essential security devices:</p>
      <ul>
        <li>Video doorbells (Ring, Nest, Arlo)</li>
        <li>Security cameras with AI detection</li>
        <li>Smart locks with multiple access methods</li>
        <li>Window and door sensors</li>
      </ul>

      <h3>3. Climate Control</h3>
      <p>Smart thermostats can significantly reduce energy costs:</p>
      <ul>
        <li>Nest Learning Thermostat</li>
        <li>Ecobee with room sensors</li>
        <li>Smart AC controllers</li>
        <li>Automated blinds and curtains</li>
      </ul>

      <h2>Advanced Integration Tips</h2>
      <p>Take your smart home to the next level with these advanced features:</p>
      
      <h3>Automation Scenarios</h3>
      <p>Create powerful automations that make your home truly smart:</p>
      <ul>
        <li>Morning routines (lights, coffee, news)</li>
        <li>Away modes (security, energy saving)</li>
        <li>Entertainment scenes</li>
        <li>Weather-based adjustments</li>
      </ul>

      <h3>Voice Control</h3>
      <p>Optimize voice commands for different scenarios:</p>
      <ul>
        <li>Strategic speaker placement</li>
        <li>Custom commands and routines</li>
        <li>Multi-room audio control</li>
        <li>Voice match for personalization</li>
      </ul>

      <h2>Privacy and Security Considerations</h2>
      <p>Protect your smart home network:</p>
      <ul>
        <li>Separate IoT network setup</li>
        <li>Regular firmware updates</li>
        <li>Strong password policies</li>
        <li>Data privacy settings</li>
      </ul>

      <h2>Future-Proofing Your Smart Home</h2>
      <p>Consider these factors for long-term success:</p>
      <ul>
        <li>Matter standard compatibility</li>
        <li>Local processing capabilities</li>
        <li>Expandability options</li>
        <li>Backup power solutions</li>
      </ul>

      <h2>Troubleshooting Common Issues</h2>
      <p>Be prepared for these common challenges:</p>
      <ul>
        <li>Network connectivity problems</li>
        <li>Device pairing issues</li>
        <li>Automation conflicts</li>
        <li>Power outage recovery</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Building a smart home is an ongoing journey. Start with the basics and expand gradually based on your needs. Focus on reliability and interoperability when choosing devices, and always prioritize security in your setup.</p>
    </article>
  `,

  'best-gaming-laptops-2024': `
    <p>Gaming laptops have come a long way, offering desktop-level performance in portable form factors. This guide will help you choose the perfect gaming laptop based on your needs and budget.</p>

    <h2>Understanding Gaming Laptop Specifications</h2>
    
    <h3>CPU Considerations</h3>
    <p>The processor is crucial for gaming performance:</p>
    <ul>
      <li>Intel 13th/14th Gen vs AMD Ryzen 7000 Series</li>
      <li>Core count and clock speeds</li>
      <li>Thermal performance</li>
      <li>Power efficiency</li>
    </ul>

    <h3>GPU Options</h3>
    <p>Graphics cards determine gaming capabilities:</p>
    <ul>
      <li>NVIDIA RTX 40 Series features</li>
      <li>AMD Radeon RX 7000M Series</li>
      <li>Ray tracing performance</li>
      <li>DLSS and FSR support</li>
    </ul>
  `,

  'pc-components-guide': `
    <p>Building a PC is both rewarding and cost-effective. This comprehensive guide covers everything you need to know about PC components and how they work together.</p>

    <h2>CPU (Central Processing Unit)</h2>
    <p>The brain of your computer:</p>
    <ul>
      <li>Understanding cores and threads</li>
      <li>Clock speeds and turbo boost</li>
      <li>Cache levels and importance</li>
      <li>TDP and cooling requirements</li>
    </ul>

  `,

  // ... Add similar detailed content for other blog posts
};

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Blog Header */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-[400px] w-full">
            <Image src={blog.image} alt={blog.title} fill className="object-cover" />
          </div>
          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{blog.title}</h1>

            {/* Share Button */}
            <Button
              variant="outline"
              size="sm"
              className="mb-8"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {/* Blog Content */}
            <div
              className="prose prose-slate lg:prose-lg xl:prose-xl max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  blogContent[slug as keyof typeof blogContent] || '<p>Content coming soon...</p>',
              }}
            />

            {/* Author Section */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/dr4guscnl/image/upload/v1735502301/pic_vetxlo.png"
                    alt="Author"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AL Shaimon</h3>
                  <p className="text-gray-600">Tech Writer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
