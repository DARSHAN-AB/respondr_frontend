"use client"

import React from "react"
import { useForm, ValidationError } from "@formspree/react"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AnimatedSection } from "@/components/animated-section"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [state, handleSubmit] = useForm("movllpzq") // Formspree form ID

  return (
    <main className="flex min-h-screen flex-col">
      <ScrollToTop />

      {/* Hero Section */}
      <section className="w-full py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="w-full py-20 bg-white">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form and our team will get back to you within 24 Business hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      onChange={(e) => e.target.value}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g, John Doe"
                    />
                    <ValidationError prefix="Name" field="name" errors={state.errors} />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={(e) => e.target.value}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="hello@respondr.in"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      onChange={(e) => e.target.value}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                    <ValidationError prefix="Subject" field="subject" errors={state.errors} />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      onChange={(e) => e.target.value}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="Your message here..."
                    ></textarea>
                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={state.submitting}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {state.submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </motion.button>

                  {state.succeeded && (
                    <motion.div
                      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Thank you for your message! We'll get back to you soon.
                    </motion.div>
                  )}

                  {state.errors && state.errors.length > 0 && (
                    <motion.div
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      There was an error sending your message. Please try again.
                    </motion.div>
                  )}
                </form>
              </div>

              <div className="lg:w-1/2">
                <div className="bg-gray-50 p-8 rounded-lg h-full">
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">Email</h4>
                        <p className="text-gray-600">respondr6@gmail.com</p>
                        <p className="text-gray-600">darshangowda.en@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">Phone</h4>
                        <p className="text-gray-600">+91 8147489287</p>
                        <p className="text-gray-600">+91 9738624467</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-red-100 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold">Office</h4>
                        <p className="text-gray-600">
                          BMSIT&M, Doddaballapura Main Road <br />
                          Avalahalli, Bengaluru - 560064 <br />
                          India
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                      {/* Facebook */}
                      <a
                        href="https://www.facebook.com/profile.php?id=61580669720527"
                        className="bg-gray-200 hover:bg-red-100 p-3 rounded-full transition duration-300"
                      >
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </a>

                      {/* Instagram */}
                      <a
                        href="https://www.instagram.com/respondr._/"
                        className="bg-gray-200 hover:bg-red-100 p-3 rounded-full transition duration-300"
                      >
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.88a.88.88 0 1 1-1.75 0 .88.88 0 0 1 1.75 0z" />
                        </svg>
                      </a>

                      {/* Twitter (X) */}
                      <a
                        href="https://x.com/respondr6"
                        className="bg-gray-200 hover:bg-red-100 p-3 rounded-full transition duration-300"
                      >
                        <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.596 2H21L14.504 9.336 22.2 22h-6.704l-4.888-7.68L5.9 22H3l7.008-7.88L2 2h6.84l4.432 6.96L18.596 2zm-1.2 18h1.528L7.92 4H6.36l11.036 16z" />
                        </svg>
                      </a>

                      {/* YouTube */}
                      <a
                        href="https://www.youtube.com/@respondr-ambulance"
                        className="bg-gray-200 hover:bg-red-100 p-3 rounded-full transition duration-300"
                      >
                        <svg
                          className="h-5 w-5 text-gray-700"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a2.97 2.97 0 00-2.09-2.1C19.524 3.5 12 3.5 12 3.5s-7.524 0-9.408.586a2.97 2.97 0 00-2.09 2.1A30.055 30.055 0 000 12a30.055 30.055 0 00.502 5.814 2.97 2.97 0 002.09 2.1C4.476 20.5 12 20.5 12 20.5s7.524 0 9.408-.586a2.97 2.97 0 002.09-2.1A30.055 30.055 0 0024 12a30.055 30.055 0 00-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                    <p className="text-gray-600 mt-2">
                      <strong>Note:</strong> Our emergency response services are available 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </main>
  )
}